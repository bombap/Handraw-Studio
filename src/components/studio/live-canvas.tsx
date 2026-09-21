import { useMemo } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Lightbox } from "@/components/gallery/lightbox";
import { StoredImage } from "@/components/studio/stored-image";
import { getStyle } from "@/lib/studio/catalog";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import { useImageAsSubject } from "@/lib/studio/subject";
import { cn } from "@/lib/utils";

export function LiveCanvas() {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const jobs = useStudio((s) => s.jobs);
  const setLightbox = useStudio((s) => s.setLightbox);
  const latestBatch = useMemo(() => {
    if (jobs.length === 0) return undefined;
    return jobs.reduce((best, job) => (job.createdAt >= best.createdAt ? job : best)).batchId;
  }, [jobs]);
  const batchJobs = useMemo(
    () => (latestBatch ? jobs.filter((j) => j.batchId === latestBatch) : []),
    [jobs, latestBatch],
  );
  const show = batchJobs.length > 0 ? batchJobs : jobs.filter((j) => j.status === "done").slice(0, 8);

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden paper-grid">
      <div className="flex shrink-0 items-baseline justify-between gap-2 px-4 py-3 sm:px-5 sm:py-4">
        <h2 className="font-display text-xl leading-tight font-medium tracking-tight">
          {copy.thisBatch}
        </h2>
        <p className="text-xs text-ink-subtle tabular-nums">{show.length}</p>
      </div>
      {show.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 pb-20 text-center">
          <p className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">{copy.emptyCanvas}</p>
          <p className="max-w-sm text-sm leading-relaxed text-ink-muted">{copy.emptyCanvasHint}</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="grid grid-cols-2 gap-4 p-4 sm:p-5 xl:grid-cols-3">
            {show.map((job) => {
              const style = getStyle(job.styleNumber);
              const ratio = job.aspectRatio.split(":").map(Number);
              const pad = ratio[1] && ratio[0] ? (ratio[1] / ratio[0]) * 100 : 100;
              return (
                <article
                  key={job.id}
                  className="rise-in overflow-hidden rounded-xl bg-surface p-1 shadow-[var(--shadow-border)]"
                >
                  <button
                    type="button"
                    className="relative block w-full overflow-hidden rounded-lg"
                    style={{ paddingBottom: `${pad}%` }}
                    onClick={() => job.imageId && setLightbox(job.imageId)}
                    disabled={!job.imageId}
                  >
                    <div className="absolute inset-0">
                      {job.imageId ? (
                        <StoredImage
                          id={job.imageId}
                          alt={`#${job.styleNumber} ${job.theme}`}
                          className="size-full"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex size-full items-center justify-center bg-bg-elevated",
                            job.status === "error" && "bg-stamp-soft",
                          )}
                        >
                          {job.status === "running" || job.status === "queued" ? (
                            <Loader2 className="size-6 animate-spin text-ink-subtle" />
                          ) : (
                            <span className="px-3 text-center text-xs text-ink-muted">
                              {job.error ?? copy[job.status]}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                  <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs tabular-nums">
                        #{job.styleNumber}
                        {job.layoutId ? ` · ${job.layoutId}` : ""}
                        {job.copies > 1 ? ` · ${job.copyIndex}/${job.copies}` : ""}
                      </p>
                      <p className="truncate text-xs text-ink-muted">{job.styleName}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {job.imageId ? (
                        <button
                          type="button"
                          className="flex size-8 items-center justify-center rounded-md text-ink-muted hover:bg-stamp-soft hover:text-ink"
                          aria-label={copy.useAsSubject}
                          onClick={() => {
                            void useImageAsSubject(job.imageId!).then((ok) => {
                              if (ok) toast.success(copy.usedAsSubject);
                            });
                          }}
                        >
                          <ImagePlus className="size-3.5" />
                        </button>
                      ) : null}
                      {style ? (
                        <img
                          src={style.previewUrl}
                          alt=""
                          className="img-outline size-8 rounded-md object-cover"
                        />
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
      <Lightbox />
    </section>
  );
}
