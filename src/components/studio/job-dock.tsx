import { useState } from "react";
import { ChevronDown, Loader2, Pause, Play, RotateCcw, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StoredImage } from "@/components/studio/stored-image";
import { getStyle } from "@/lib/studio/catalog";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import { wakeQueue } from "@/lib/studio/queue";
import type { JobStatus } from "@/lib/studio/types";
import { cn, formatDuration } from "@/lib/utils";

const STRIPE: Record<JobStatus, string> = {
  queued: "bg-line-strong",
  running: "bg-warn",
  done: "bg-ok",
  error: "bg-danger",
  cancelled: "bg-line",
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
  const [open, setOpen] = useState(false);

  const live = jobs.filter((j) => j.status === "queued" || j.status === "running");
  const done = jobs.filter((j) => j.status === "done").length;
  const failed = jobs.filter((j) => j.status === "error");
  const recent = jobs.slice(0, 24);
  const total = jobs.length;
  const progress = total ? (done / total) * 100 : 0;
  const queued = jobs.filter((j) => j.status === "queued").length;
  const etaMs = queued * (avg / Math.max(1, concurrency));
  const summary = [
    live.length ? `${live.length} ${copy.running.toLowerCase()}` : null,
    done ? `${done} ${copy.done.toLowerCase()}` : null,
    failed.length ? `${failed.length} ${copy.error.toLowerCase()}` : null,
    etaMs >= 1000 ? `${copy.eta} ${formatDuration(etaMs)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="shrink-0 border-t border-line bg-bg-elevated/90 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-expanded={open}
          aria-label={open ? copy.collapseQueue : copy.expandQueue}
        >
          <ChevronDown
            className={cn("size-4 shrink-0 text-ink-subtle transition-transform duration-150", !open && "-rotate-90")}
          />
          <h2 className="font-display text-sm font-medium tracking-tight">{copy.queue}</h2>
          <p className="truncate text-xs text-ink-subtle tabular-nums">{summary}</p>
        </button>
        <div className="hidden items-center gap-0.5 rounded-full bg-surface p-0.5 shadow-[var(--shadow-border)] sm:flex">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setConcurrency(n)}
              className={cn(
                "size-7 rounded-full text-xs tabular-nums",
                concurrency === n ? "bg-ink text-bg" : "text-ink-muted hover:text-ink",
              )}
              aria-label={`${copy.concurrency} ${n}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {live.length > 0 ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (paused) wakeQueue();
                else setPaused(true);
              }}
            >
              {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              <span className="hidden sm:inline">{paused ? copy.resume : copy.pause}</span>
            </Button>
          ) : null}
          {queued > 0 ? (
            <Button size="sm" variant="ghost" onClick={cancelQueued}>
              <Square className="size-3.5" />
              <span className="hidden md:inline">{copy.cancelAll}</span>
            </Button>
          ) : null}
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
          <div className="px-3 sm:px-4">
            <Progress value={progress} className="h-0.5" />
          </div>
          <div className="film-scroll flex gap-2 overflow-x-auto px-3 py-2 sm:px-4">
            {recent.map((job) => {
              const style = getStyle(job.styleNumber);
              const liveJob = job.status === "queued" || job.status === "running";
              return (
                <article key={job.id} className="w-16 shrink-0">
                  <div className="relative">
                    <button
                      type="button"
                      className="relative block aspect-square w-full overflow-hidden rounded-lg bg-bg-elevated shadow-[var(--shadow-border)]"
                      onClick={() => {
                        setActiveJob(job.id);
                        if (job.imageId) setLightbox(job.imageId);
                      }}
                    >
                      {job.kind === "video" && job.sourceImageId ? (
                        <StoredImage id={job.sourceImageId} alt="" className={cn("size-full", liveJob && "opacity-60")} />
                      ) : job.imageId ? (
                        <StoredImage id={job.imageId} alt={`#${job.styleNumber}`} className="size-full" />
                      ) : style ? (
                        <img
                          src={style.previewUrl}
                          alt=""
                          className={cn("size-full object-cover", liveJob && "opacity-60")}
                        />
                      ) : (
                        <div className="size-full bg-line" />
                      )}
                      {job.status === "running" ? (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="size-4 animate-spin text-ink" />
                        </span>
                      ) : null}
                      <span className={cn("absolute inset-x-1 bottom-1 h-0.5 rounded-full", STRIPE[job.status])} />
                    </button>
                    {liveJob ? (
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-ink text-bg"
                        onClick={() => cancelJob(job.id)}
                        aria-label={copy.cancel}
                      >
                        <X className="size-3" />
                      </button>
                    ) : null}
                    {job.status === "error" || job.status === "cancelled" ? (
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-ink text-bg"
                        onClick={() => retryJob(job.id)}
                        aria-label={copy.retry}
                      >
                        <RotateCcw className="size-3" />
                      </button>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-center font-mono text-[10px] text-ink-muted tabular-nums">
                    #{job.styleNumber}
                    {job.copies > 1 ? ` ${job.copyIndex}/${job.copies}` : ""}
                  </p>
                </article>
              );
            })}
          </div>
        </>
      ) : null}
    </section>
  );
}
