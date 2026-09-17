import { useState } from "react";
import { ChevronDown, Loader2, Pause, Play, RotateCcw, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StoredImage } from "@/components/studio/stored-image";
import { getStyle } from "@/lib/studio/catalog";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import type { JobStatus } from "@/lib/studio/types";
import { cn, formatDuration } from "@/lib/utils";

const STATUS_VARIANT: Record<JobStatus, "muted" | "warn" | "ok" | "danger" | "outline"> = {
  queued: "muted",
  running: "warn",
  done: "ok",
  error: "danger",
  cancelled: "outline",
};

export function JobDock() {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const jobs = useStudio((s) => s.jobs);
  const paused = useStudio((s) => s.paused);
  const setPaused = useStudio((s) => s.setPaused);
  const cancelJob = useStudio((s) => s.cancelJob);
  const cancelQueued = useStudio((s) => s.cancelQueued);
  const retryJob = useStudio((s) => s.retryJob);
  const retryFailed = useStudio((s) => s.retryFailed);
  const setActiveJob = useStudio((s) => s.setActiveJob);
  const setLightbox = useStudio((s) => s.setLightbox);
  const durations = useStudio((s) => s.durations);
  const concurrency = useStudio((s) => s.concurrency);
  const setConcurrency = useStudio((s) => s.setConcurrency);
  const avg = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 28000;
  const [open, setOpen] = useState(true);

  const live = jobs.filter((j) => j.status === "queued" || j.status === "running");
  const done = jobs.filter((j) => j.status === "done").length;
  const failed = jobs.filter((j) => j.status === "error");
  const recent = jobs.slice(0, 24);
  const total = jobs.length;
  const progress = total ? (done / total) * 100 : 0;
  const queued = jobs.filter((j) => j.status === "queued").length;
  const etaMs = queued * (avg / Math.max(1, concurrency));

  return (
    <section className="shrink-0 border-t border-line bg-bg-elevated/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-3 py-2 sm:px-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-expanded={open}
          aria-label={open ? copy.collapseQueue : copy.expandQueue}
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-ink-subtle transition-transform duration-150",
              !open && "-rotate-90",
            )}
          />
          <h2 className="font-display text-base font-medium tracking-tight">{copy.queue}</h2>
          <p className="truncate text-xs text-ink-subtle tabular-nums">
            {live.length} {copy.running.toLowerCase()} · {copy.eta} {formatDuration(etaMs)} ·{" "}
            {concurrency} {copy.workers}
          </p>
        </button>
        <div className="hidden items-center gap-0.5 rounded-md bg-surface p-0.5 shadow-[var(--shadow-border)] sm:flex">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setConcurrency(n)}
              className={cn(
                "size-8 rounded-sm text-xs tabular-nums",
                concurrency === n ? "bg-ink text-bg" : "text-ink-muted hover:text-ink",
              )}
              aria-label={`${copy.concurrency} ${n}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="secondary" onClick={() => setPaused(!paused)}>
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            <span className="hidden sm:inline">{paused ? copy.resume : copy.pause}</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelQueued}>
            <Square className="size-3.5" />
            <span className="hidden md:inline">{copy.cancelAll}</span>
          </Button>
          {failed.length > 0 ? (
            <Button size="sm" variant="outline" onClick={retryFailed}>
              <RotateCcw className="size-3.5" />
              <span className="hidden md:inline">{copy.retryFailed}</span>
            </Button>
          ) : null}
        </div>
      </div>
      {open ? (
        <>
          <div className="px-3 pb-2 sm:px-5">
            <Progress value={progress} />
          </div>
          <div className="film-scroll flex gap-2 overflow-x-auto px-3 pb-3 sm:px-5">
            {recent.map((job) => {
              const style = getStyle(job.styleNumber);
              return (
                <article
                  key={job.id}
                  className="w-28 shrink-0 overflow-hidden rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]"
                >
                  <button
                    type="button"
                    className="relative block aspect-square w-full overflow-hidden rounded-md bg-bg-elevated"
                    onClick={() => {
                      setActiveJob(job.id);
                      if (job.imageId) setLightbox(job.imageId);
                    }}
                  >
                    {job.imageId ? (
                      <StoredImage
                        id={job.imageId}
                        alt={`#${job.styleNumber}`}
                        className="size-full"
                      />
                    ) : style ? (
                      <img
                        src={style.previewUrl}
                        alt=""
                        className="size-full object-cover opacity-70"
                      />
                    ) : (
                      <div className="size-full bg-line" />
                    )}
                    {job.status === "running" || job.status === "queued" ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
                        <Loader2 className="size-5 animate-spin text-surface" />
                      </span>
                    ) : null}
                  </button>
                  <div className="flex items-start justify-between gap-1 px-1 pt-1.5 pb-0.5">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs tabular-nums">#{job.styleNumber}</p>
                      <Badge variant={STATUS_VARIANT[job.status]} className="mt-0.5">
                        {copy[job.status]}
                      </Badge>
                    </div>
                    {job.status === "queued" || job.status === "running" ? (
                      <button
                        type="button"
                        className="flex size-7 items-center justify-center rounded-sm text-ink-subtle hover:bg-line hover:text-ink"
                        onClick={() => cancelJob(job.id)}
                        aria-label={copy.cancel}
                      >
                        <Square className="size-3" />
                      </button>
                    ) : null}
                    {job.status === "error" || job.status === "cancelled" ? (
                      <button
                        type="button"
                        className="flex size-7 items-center justify-center rounded-sm text-ink-subtle hover:bg-line hover:text-ink"
                        onClick={() => retryJob(job.id)}
                        aria-label={copy.retry}
                      >
                        <RotateCcw className="size-3" />
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      ) : null}
    </section>
  );
}
