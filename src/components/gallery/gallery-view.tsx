import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Heart, ImagePlus, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Lightbox } from "@/components/gallery/lightbox";
import { StoredImage } from "@/components/studio/stored-image";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import { useImageAsSubject } from "@/lib/studio/subject";
import { cn } from "@/lib/utils";

export function GalleryView() {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const navigate = useNavigate();
  const gallery = useStudio((s) => s.gallery);
  const setLightbox = useStudio((s) => s.setLightbox);
  const toggleFav = useStudio((s) => s.toggleGalleryFavorite);
  const [q, setQ] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    return gallery.filter((g) => {
      if (onlyFav && !g.favorite) return false;
      if (!query) return true;
      return (
        g.styleNumber.includes(query) ||
        g.styleName.toLowerCase().includes(query) ||
        g.theme.toLowerCase().includes(query)
      );
    });
  }, [gallery, q, onlyFav]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="flex flex-col gap-4 border-b border-line px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">{copy.gallery}</h1>
          <p className="mt-1 text-sm text-ink-muted tabular-nums">
            {items.length}
            {copy.of}
            {gallery.length}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-2 sm:max-w-md sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={copy.searchGallery}
              className="pl-9"
            />
          </div>
          <button
            type="button"
            onClick={() => setOnlyFav(!onlyFav)}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm",
              onlyFav ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted",
            )}
          >
            <Heart className={cn("size-3.5", onlyFav && "fill-current")} />
            {copy.filterFav}
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center">
          <p className="font-display text-3xl font-medium tracking-tight">{copy.emptyGallery}</p>
          <p className="text-sm text-ink-muted">{copy.emptyGalleryHint}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-xl bg-surface p-1 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]"
            >
              <button
                type="button"
                className="block w-full overflow-hidden rounded-lg"
                onClick={() => setLightbox(item.id)}
              >
                <StoredImage
                  id={item.id}
                  alt={`#${item.styleNumber} ${item.theme}`}
                  className="aspect-square w-full"
                />
              </button>
              <div className="flex items-start justify-between gap-2 px-2.5 py-2">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs tabular-nums">#{item.styleNumber}</p>
                  <p className="truncate text-xs text-ink-muted">{item.theme}</p>
                </div>
                <div className="flex shrink-0">
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center text-ink-subtle hover:text-ink"
                    onClick={() => {
                      void useImageAsSubject(item.id).then((ok) => {
                        if (ok) {
                          toast.success(copy.usedAsSubject);
                          void navigate({ to: "/" });
                        }
                      });
                    }}
                    aria-label={copy.useAsSubject}
                  >
                    <ImagePlus className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    className="flex size-8 shrink-0 items-center justify-center text-ink-subtle hover:text-stamp"
                    onClick={() => toggleFav(item.id)}
                    aria-label={copy.favorites}
                  >
                    <Heart className={cn("size-3.5", item.favorite && "fill-stamp text-stamp")} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <Lightbox />
    </div>
  );
}
