import { Check, ChevronDown, Link2, Minus, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { COLORS, getColor } from "@/lib/studio/color-catalog";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import { ASPECT_OPTIONS, MAX_COPIES, type Resolution } from "@/lib/studio/types";
import { cn } from "@/lib/utils";

function RatioGlyph({ w, h }: { w: number; h: number }) {
  const max = Math.max(w, h);
  return (
    <span
      className="inline-block rounded-[1px] border border-current opacity-80"
      style={{ width: `${6 + (w / max) * 10}px`, height: `${6 + (h / max) * 10}px` }}
    />
  );
}

export function RatioControl() {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const aspectRatio = useStudio((s) => s.aspectRatio);
  const setAspectRatio = useStudio((s) => s.setAspectRatio);
  const current = ASPECT_OPTIONS.find((o) => o.id === aspectRatio) ?? ASPECT_OPTIONS[0];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-12 min-w-12 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-surface px-3 text-sm font-medium text-ink shadow-[var(--shadow-border)] lg:h-11 lg:rounded-md lg:px-2.5 lg:text-xs"
          aria-label={copy.aspect}
        >
          <RatioGlyph w={current.w} h={current.h} />
          <span className="tabular-nums">{current.label}</span>
          <ChevronDown className="size-3.5 text-ink-subtle" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="end">
        <p className="mb-1.5 px-2 text-xs font-medium text-ink-muted">{copy.aspect}</p>
        <div className="flex max-h-80 flex-col gap-0.5 overflow-y-auto">
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAspectRatio(opt.id)}
              className={cn(
                "flex h-11 items-center gap-3 rounded-md px-2 text-left",
                aspectRatio === opt.id ? "bg-ink text-bg" : "text-ink hover:bg-stamp-soft",
              )}
            >
              <RatioGlyph w={opt.w} h={opt.h} />
              <span className="font-mono text-sm tabular-nums">{opt.id}</span>
              <span className={cn("text-xs", aspectRatio === opt.id ? "text-bg/70" : "text-ink-muted")}>
                {lang === "vi" ? opt.nameVi : opt.nameEn}
              </span>
              {aspectRatio === opt.id ? <Check className="ml-auto size-3.5" /> : null}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ResolutionControl() {
  const resolution = useStudio((s) => s.resolution);
  const setResolution = useStudio((s) => s.setResolution);
  return (
    <div className="flex h-12 flex-1 items-center rounded-lg bg-surface p-1 shadow-[var(--shadow-border)] lg:h-11 lg:flex-none lg:rounded-md">
      {(["1k", "2k"] as Resolution[]).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setResolution(r)}
          className={cn(
            "h-10 flex-1 rounded-md px-2 text-sm font-medium uppercase lg:h-9 lg:min-w-10 lg:flex-none lg:text-xs",
            resolution === r ? "bg-ink text-bg" : "text-ink-muted hover:text-ink",
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

export function CopiesControl() {
  const copy = t(useStudio((s) => s.lang));
  const copies = useStudio((s) => s.copiesPerStyle);
  const setCopies = useStudio((s) => s.setCopiesPerStyle);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex h-12 shrink-0 items-center rounded-lg bg-surface p-1 shadow-[var(--shadow-border)] lg:h-11 lg:rounded-md"
          aria-label={copy.copies}
        >
          <button
            type="button"
            disabled={copies <= 1}
            onClick={() => setCopies(copies - 1)}
            className="flex size-10 items-center justify-center rounded-md text-ink-muted hover:text-ink disabled:opacity-30 lg:size-9"
            aria-label="−"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="min-w-8 text-center text-sm font-medium tabular-nums lg:text-xs">×{copies}</span>
          <button
            type="button"
            disabled={copies >= MAX_COPIES}
            onClick={() => setCopies(copies + 1)}
            className="flex size-10 items-center justify-center rounded-md text-ink-muted hover:text-ink disabled:opacity-30 lg:size-9"
            aria-label="+"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </TooltipTrigger>
      <TooltipContent>{copy.copiesHint}</TooltipContent>
    </Tooltip>
  );
}

export function ColorControl() {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const colorId = useStudio((s) => s.colorId);
  const setColorId = useStudio((s) => s.setColorId);
  const color = getColor(colorId);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-lg bg-surface px-2.5 shadow-[var(--shadow-border)] lg:h-11 lg:rounded-md"
          aria-label={copy.color}
        >
          <span
            className="size-4 rounded-full shadow-[var(--shadow-border)]"
            style={{
              background: color?.hex ?? "conic-gradient(#002FA7,#9CAF88,#DE2910,#C9A0A0,#CC7722,#002FA7)",
            }}
          />
          {color ? <span className="font-mono text-xs tabular-nums">{color.id}</span> : null}
          <ChevronDown className="size-3.5 text-ink-subtle" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-xs font-medium text-ink-muted">{copy.color}</p>
          {color ? (
            <button type="button" className="text-xs text-stamp" onClick={() => setColorId(null)}>
              {copy.colorClear}
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {COLORS.map((item) => (
            <button
              key={item.id}
              type="button"
              title={lang === "vi" ? item.nameVi : item.nameEn}
              onClick={() => setColorId(colorId === item.id ? null : item.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md p-1",
                colorId === item.id ? "bg-ink text-bg" : "hover:bg-stamp-soft",
              )}
            >
              <span className="size-8 rounded-full shadow-[var(--shadow-border)]" style={{ background: item.hex }} />
              <span className="font-mono text-[10px] tabular-nums">{item.id.slice(2)}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 px-1 text-[11px] leading-snug text-ink-muted">
          {color ? `${color.id} · ${lang === "vi" ? color.nameVi : color.nameEn}. ` : ""}
          {copy.colorHint}
        </p>
      </PopoverContent>
    </Popover>
  );
}

export function LockControl({ size }: { size: "sm" | "md" }) {
  const copy = t(useStudio((s) => s.lang));
  const characterLock = useStudio((s) => s.characterLock);
  const setCharacterLock = useStudio((s) => s.setCharacterLock);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setCharacterLock(!characterLock)}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 shadow-[var(--shadow-border)]",
            size === "sm" ? "h-12 rounded-lg px-3" : "size-11 rounded-md",
            characterLock ? "bg-ink text-bg" : "bg-surface text-ink-muted hover:text-ink",
          )}
          aria-pressed={characterLock}
          aria-label={copy.characterLock}
        >
          <Link2 className="size-3.5" />
          {size === "sm" ? <span className="text-xs font-medium">{copy.characterLock}</span> : null}
        </button>
      </TooltipTrigger>
      <TooltipContent>{copy.characterLockHint}</TooltipContent>
    </Tooltip>
  );
}
