import { ImagePlus, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";

export function SubjectSlot({
  preview,
  onPick,
  onClear,
}: {
  preview: string | null;
  onPick: () => void;
  onClear: () => void;
}) {
  const copy = t(useStudio((s) => s.lang));
  if (preview) {
    return (
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg shadow-[var(--shadow-border)] lg:size-11 lg:rounded-md">
        <img src={preview} alt="" className="img-outline size-full object-cover" />
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-0 flex items-center justify-center bg-ink/50 text-bg"
          aria-label={copy.removeImage}
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onPick}
          className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-line-strong bg-surface text-ink-muted hover:border-stamp hover:text-ink lg:size-11 lg:rounded-md"
          aria-label={copy.attach}
        >
          <ImagePlus className="size-5 lg:size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{copy.attachHint}</TooltipContent>
    </Tooltip>
  );
}
