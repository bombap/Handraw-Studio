import { generateStyledImage } from "./generate";
import { pollStyledVideo, startStyledVideo } from "./generate-video";
import { getImageBlob } from "./idb";
import { userImageRef } from "./session";
import { useStudio } from "./store";
import { resizeImageDataUrl } from "@/lib/utils";

const inFlight = new Set<string>();
const batchSubjects = new Map<string, string>();
let timer: number | undefined;
let backoffUntil = 0;
let reducedUntil = 0;
let unsub: (() => void) | undefined;
let videoChain: Promise<void> = Promise.resolve();
let lastVideoCall = 0;

/** grok-imagine-video-1.5 is capped at 2 requests/second. Keep a gap under that. */
const VIDEO_GAP_MS = 1100;

function paceVideo<T>(fn: () => Promise<T>): Promise<T> {
  const run = videoChain.then(async () => {
    const wait = lastVideoCall + VIDEO_GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastVideoCall = Date.now();
    return fn();
  });
  videoChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

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
    if (j.kind === "video" && j.videoRequestId) {
      inFlight.add(j.id);
      void runVideo(j.id);
      continue;
    }
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

  const queued = live.jobs.filter((j) => j.status === "queued" && canStart(j));
  let videoStarted = false;

  for (const job of queued) {
    if (inFlight.has(job.id)) continue;
    const runningNow = useStudio
      .getState()
      .jobs.filter((j) => j.status === "running" || inFlight.has(j.id)).length;
    if (runningNow >= cap) break;
    if (job.kind === "video") {
      if (videoStarted || Date.now() < lastVideoCall + VIDEO_GAP_MS) continue;
      videoStarted = true;
    }
    inFlight.add(job.id);
    useStudio.getState().patchJob(job.id, { status: "running", startedAt: Date.now() });
    const lockUrl = batchSubjects.get(job.batchId);
    void (job.kind === "video" ? runVideo(job.id) : runJob(job.id, lockUrl || userImageRef.current));
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
        colorId: job.colorId,
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

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(blob);
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runVideo(id: string) {
  const job = useStudio.getState().jobs.find((j) => j.id === id);
  if (!job || job.status === "cancelled" || job.status === "done") {
    inFlight.delete(id);
    return;
  }
  try {
    let requestId = job.videoRequestId;
    if (!requestId) {
      if (!job.sourceImageId) throw new Error("Missing source image");
      const blob = await getImageBlob(job.sourceImageId);
      if (!blob) throw new Error("Không tìm thấy ảnh nguồn");
      let dataUrl = await blobToDataUrl(blob);
      if (dataUrl.length > 4_000_000) dataUrl = await resizeImageDataUrl(dataUrl, 1280, 0.85);
      const started = await paceVideo(() =>
        startStyledVideo({
          data: {
            imageDataUrl: dataUrl,
            prompt: job.theme,
            duration: Math.min(15, Math.max(1, Math.round(job.videoDuration ?? 6))),
            aspectRatio: job.aspectRatio,
          },
        }),
      );
      if (!started.ok) {
        if (isRateLimited(started.error)) {
          lastVideoCall = Date.now() + 2000;
          useStudio.getState().patchJob(id, { status: "queued", startedAt: undefined });
          return;
        }
        throw new Error(started.error);
      }
      requestId = started.requestId;
      useStudio.getState().patchJob(id, { videoRequestId: requestId });
    }

    const deadline = Date.now() + 4 * 60 * 1000;
    while (Date.now() < deadline) {
      const latest = useStudio.getState().jobs.find((j) => j.id === id);
      if (!latest || latest.status === "cancelled" || latest.status === "done") return;
      const polled = await paceVideo(() => pollStyledVideo({ data: { requestId } }));
      if (!polled.ok) {
        if (isRateLimited(polled.error)) {
          lastVideoCall = Date.now() + 2000;
          await sleep(3000);
          continue;
        }
        throw new Error(polled.error);
      }
      if (polled.status === "done") {
        await useStudio.getState().addGalleryFromJob(
          { ...latest, promptEn: latest.theme },
          polled.dataUrl,
        );
        return;
      }
      await sleep(8000);
    }
    throw new Error("Video quá thời gian chờ");
  } catch (err) {
    const latest = useStudio.getState().jobs.find((j) => j.id === id);
    if (!latest || latest.status === "cancelled" || latest.status === "done") return;
    useStudio.getState().patchJob(id, {
      status: "error",
      error: err instanceof Error ? err.message : "Video failed",
      finishedAt: Date.now(),
    });
  } finally {
    inFlight.delete(id);
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