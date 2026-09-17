import { Download, Heart, ImagePlus, Trash2, X } from "lucide-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StoredImage } from "@/components/studio/stored-image";
import { getImageObjectUrl } from "@/lib/studio/idb";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import { useImageAsSubject } from "@/lib/studio/subject";

export function Lightbox() {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const id = useStudio((s) => s.lightboxId);
  const setLightbox = useStudio((s) => s.setLightbox);
  const gallery = useStudio((s) => s.gallery);
  const jobs = useStudio((s) => s.jobs);
  const toggleFav = useStudio((s) => s.toggleGalleryFavorite);
  const deleteItem = useStudio((s) => s.deleteGalleryItem);
  const item = id ? gallery.find((g) => g.id === id) : undefined;
  const job = id ? jobs.find((j) => j.id === id || j.imageId === id) : undefined;

  if (!id || !item) return null;

  const current = item;
  const imageId = id;
  const prompt = job?.promptEn ?? current.promptEn;

  async function download() {
    const url = await getImageObjectUrl(imageId);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `handraw-${current.styleNumber}-${current.id}.png`;
    a.click();
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    toast.success(copy.copied);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-3 sm:p-6"
      onClick={() => setLightbox(null)}
      role="dialog"
      aria-modal
    >
      <div
        className="relative flex max-h-[92vh] w-[min(96vw,920px)] flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border-hover)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-md bg-surface/90 text-ink-muted hover:text-ink"
          onClick={() => setLightbox(null)}
          aria-label={copy.close}
        >
          <X className="size-4" />
        </button>
        <StoredImage
          id={current.id}
          alt={`#${current.styleNumber} ${current.theme}`}
          className="max-h-[70vh] w-full object-contain"
        />
        <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="font-display text-lg font-medium tracking-tight">
              #{current.styleNumber} · {current.styleName}
            </p>
            <p className="text-sm text-ink-muted">{current.theme}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                void useImageAsSubject(current.id).then((ok) => {
                  if (ok) {
                    toast.success(copy.usedAsSubject);
                    setLightbox(null);
                    if (pathname.startsWith("/gallery")) void navigate({ to: "/" });
                  }
                });
              }}
            >
              <ImagePlus className="size-3.5" />
              {copy.useAsSubject}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => void copyPrompt()}>
              {copy.copyPrompt}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => void download()}>
              <Download className="size-3.5" />
              {copy.download}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => toggleFav(current.id)}>
              <Heart className={current.favorite ? "size-3.5 fill-stamp text-stamp" : "size-3.5"} />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void deleteItem(current.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
