import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import type { Style } from "@/lib/studio/types";

export function StyleDetail({
  style,
  open,
  onOpenChange,
  onUse,
}: {
  style?: Style;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUse: (number: string) => void;
}) {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  if (!style) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogTitle>
          #{style.number} · {style.generationName}
        </DialogTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-[240px_1fr]">
          <img
            src={style.previewUrl}
            alt={style.generationName}
            className="img-outline aspect-square w-full rounded-lg object-cover"
          />
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge>{style.groupId}</Badge>
              <Badge variant="muted">{lang === "vi" ? style.groupLabelVi : style.groupLabelEn}</Badge>
            </div>
            <p className="text-sm text-ink-muted">
              {lang === "vi" ? "Tác giả / tên style" : "Author / style name"}: {style.reference}
            </p>
            <p className="text-sm leading-relaxed">{style.traits}</p>
            <Button className="mt-auto w-fit" onClick={() => onUse(style.number)}>
              {copy.useStyle}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
