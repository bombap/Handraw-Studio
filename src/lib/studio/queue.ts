import { generateStyledImage } from "./generate";
import { useStudio } from "./store";

const inFlight = new Set<string>();
const batchSubjects = new Map<string, string>();
let timer: number | undefined;
let backoffUntil = 0;
let reducedUntil = 0;
let booted = false;

function isRateLimited(message: string): boolean {
  return /429|rate limit|too many|quota|capacity/i.test(message);
}

function anchorFailed(batchId: string): boolean {
  const siblings = useStudio.getState().jobs.filter((j) => j.batchId === batchId);
  const anchor = siblings.find((j) => !j.waitsForAnchor);
  return Boolean(anchor && (anchor.status === "error" || anchor.status === "cancelled"));
}

function batchDone(batchId: string): boolean {
  return useStudio
    .getState()
    .jobs.filter((j) => j.batchId === batchId)
    .every((j) => j.status === "done" || j.status === "error" || j.status === "cancelled");
}

function canStart(job: { id: string; waitsForAnchor?: boolean; batchId: string }): boolean {
  if (inFlight.has(job.id)) return false;
  if (!job.waitsForAnchor) return true;
  if (batchSubjects.has(job.batchId)) return true;
  return anchorFailed(job.batchId);
}

async function tick(userImageRef: { current: string | null }) {
  const state = useStudio.getState();
  if (state.paused) return;
  if (Date.now() < backoffUntil) return;

  const cap = Date.now() < reducedUntil ? 1 : state.concurrency;
  const running = state.jobs.filter((j) => j.status === "running").length + inFlight.size;
  const slots = Math.max(0, cap - running);
  if (slots === 0) return;

  const queued = state.jobs.filter((j) => j.status === "queued" && canStart(j)).slice(0, slots);

  for (const job of queued) {
    inFlight.add(job.id);
    useStudio.getState().patchJob(job.id, { status: "running", startedAt: Date.now() });
    const lockUrl = batchSubjects.get(job.batchId);
    void runJob(job.id, lockUrl || userImageRef.current);
  }
}

async function runJob(id: string, userImageDataUrl: string | null) {
  const job = useStudio.getState().jobs.find((j) => j.id === id);
  if (!job) {
    inFlight.delete(id);
    return;
  }
  if (job.status === "cancelled") {
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
      },
    });

    const latest = useStudio.getState().jobs.find((j) => j.id === id);
    if (!latest || latest.status === "cancelled") return;

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
    if (!latest || latest.status === "cancelled") return;
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

export function startJobRunner(userImageRef: { current: string | null }) {
  if (timer) return () => undefined;
  if (!booted) {
    booted = true;
    const leftover = useStudio.getState().jobs.some((j) => j.status === "queued");
    if (leftover) useStudio.getState().setPaused(true);
  }
  const kick = () => void tick(userImageRef);
  timer = window.setInterval(kick, 450);
  const unsub = useStudio.subscribe(kick);
  kick();
  return () => {
    window.clearInterval(timer);
    timer = undefined;
    unsub();
  };
}
