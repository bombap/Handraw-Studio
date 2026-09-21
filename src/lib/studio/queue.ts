import { generateStyledImage } from "./generate";
import { userImageRef } from "./session";
import { useStudio } from "./store";

const inFlight = new Set<string>();
const batchSubjects = new Map<string, string>();
let timer: number | undefined;
let backoffUntil = 0;
let reducedUntil = 0;
let unsub: (() => void) | undefined;

function isRateLimited(message: string): boolean {
  return /429|rate limit|too many|quota|capacity/i.test(message);
}

function siblings(batchId: string) {
  return useStudio.getState().jobs.filter((j) => j.batchId === batchId);
}

function anchorFailed(batchId: string): boolean {
  const anchor = siblings(batchId).find((j) => !j.waitsForAnchor);
  return Boolean(anchor && (anchor.status === "error" || anchor.status === "cancelled"));
}

function batchDone(batchId: string): boolean {
  return siblings(batchId).every(
    (j) => j.status === "done" || j.status === "error" || j.status === "cancelled",
  );
}

function canStart(job: { id: string; waitsForAnchor?: boolean; batchId: string }): boolean {
  if (inFlight.has(job.id)) return false;
  if (!job.waitsForAnchor) return true;
  if (batchSubjects.has(job.batchId)) return true;
  if (anchorFailed(job.batchId)) return true;
  const anchor = siblings(job.batchId).find((j) => !j.waitsForAnchor);
  if (!anchor) return true;
  if (anchor.status === "queued" || anchor.status === "running") return false;
  return true;
}

function recoverOrphans() {
  const now = Date.now();
  for (const j of useStudio.getState().jobs) {
    if (j.status !== "running") continue;
    if (inFlight.has(j.id)) continue;
    if (now - (j.startedAt ?? 0) < 1500) continue;
    useStudio.getState().patchJob(j.id, { status: "queued", startedAt: undefined });
  }
}

function tick() {
  const state = useStudio.getState();
  if (state.paused) return;

  recoverOrphans();

  const live = useStudio.getState();
  const anyRunning = live.jobs.some((j) => j.status === "running") || inFlight.size > 0;
  if (Date.now() < backoffUntil && anyRunning) return;
  if (Date.now() < backoffUntil && !anyRunning) backoffUntil = 0;

  const cap = Math.max(1, Math.min(4, Date.now() < reducedUntil ? 1 : live.concurrency || 2));
  const running = live.jobs.filter((j) => j.status === "running" || inFlight.has(j.id)).length;
  const slots = Math.max(0, cap - running);
  if (slots === 0) return;

  const queued = live.jobs.filter((j) => j.status === "queued" && canStart(j)).slice(0, slots);

  for (const job of queued) {
    if (inFlight.has(job.id)) continue;
    inFlight.add(job.id);
    useStudio.getState().patchJob(job.id, { status: "running", startedAt: Date.now() });
    const lockUrl = batchSubjects.get(job.batchId);
    void runJob(job.id, lockUrl || userImageRef.current);
  }
}

async function runJob(id: string, userImageDataUrl: string | null) {
  const job = useStudio.getState().jobs.find((j) => j.id === id);
  if (!job || job.status === "cancelled" || job.status === "done" || job.status === "error") {
    inFlight.delete(id);
    return;
  }

  try {
    const image = userImageDataUrl || undefined;
    const result = await generateStyledImage({
      data: {
        styleNumber: job.styleNumber,
        theme: job.theme,
        aspectRatio: job.aspectRatio,
        resolution: job.resolution,
        userImageDataUrl: job.hasUserImage || job.waitsForAnchor ? image : undefined,
        characterLock: job.characterLock,
        copyIndex: job.copyIndex,
        copies: job.copies,
        seed: job.seed,
        layoutId: job.layoutId,
      },
    });

    const latest = useStudio.getState().jobs.find((j) => j.id === id);
    if (!latest || latest.status === "cancelled" || latest.status === "done") return;

    if (!result.ok) {
      if (isRateLimited(result.error)) {
        backoffUntil = Date.now() + 8000 * Math.max(1, job.retryCount + 1);
        reducedUntil = Date.now() + 45000;
      }
      useStudio.getState().patchJob(id, {
        status: "error",
        error: result.error,
        finishedAt: Date.now(),
        promptEn: result.promptEn ?? job.promptEn,
        promptZh: result.promptZh ?? job.promptZh,
      });
      return;
    }

    if (job.characterLock && !job.waitsForAnchor) {
      batchSubjects.set(job.batchId, result.dataUrl);
    }

    await useStudio.getState().addGalleryFromJob(
      {
        ...latest,
        promptEn: result.promptEn,
        promptZh: result.promptZh,
        usedStyleRef: result.usedStyleRef,
      },
      result.dataUrl,
    );
  } catch (err) {
    const latest = useStudio.getState().jobs.find((j) => j.id === id);
    if (!latest || latest.status === "cancelled" || latest.status === "done") return;
    useStudio.getState().patchJob(id, {
      status: "error",
      error: err instanceof Error ? err.message : "Generate failed",
      finishedAt: Date.now(),
    });
  } finally {
    inFlight.delete(id);
    const jobNow = useStudio.getState().jobs.find((j) => j.id === id);
    if (jobNow && batchDone(jobNow.batchId)) batchSubjects.delete(jobNow.batchId);
  }
}

export function ensureRunner() {
  if (typeof window === "undefined") return;
  if (timer) {
    tick();
    return;
  }
  const kick = () => tick();
  timer = window.setInterval(kick, 400);
  unsub = useStudio.subscribe(kick);
  kick();
}

export function wakeQueue() {
  backoffUntil = 0;
  useStudio.getState().setPaused(false);
  ensureRunner();
}

export function startJobRunner(_userImageRef?: { current: string | null }) {
  ensureRunner();
  return () => undefined;
}