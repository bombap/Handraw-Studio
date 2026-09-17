import { useEffect, useRef, useState } from "react";
import { ChevronDown, Clock3, ImagePlus, Link2, Loader2, Shuffle, Sparkles, Undo2, WandSparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { enhanceTheme } from "@/lib/studio/enhance";
import { checkAiAvailable } from "@/lib/studio/generate";
import { getStyle } from "@/lib/studio/catalog";
import { t } from "@/lib/studio/i18n";
import { userImageRef } from "@/lib/studio/session";
import { pickSpark } from "@/lib/studio/sparks";
import { useStudio } from "@/lib/studio/store";
import { clearSubject, setSubjectDataUrl } from "@/lib/studio/subject";
import { ASPECT_OPTIONS, MAX_BATCH, type EnhanceLevel, type Resolution, type StyleGroupId } from "@/lib/studio/types";
import {
  cn,
  extractClipboardImage,
  imageSizeFromDataUrl,
  nearestAspect,
  resizeImageDataUrl,
} from "@/lib/utils";

export function ComposePanel() {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const theme = useStudio((s) => s.theme);
  const setTheme = useStudio((s) => s.setTheme);
  const selected = useStudio((s) => s.selected);
  const toggleStyle = useStudio((s) => s.toggleStyle);
  const aspectRatio = useStudio((s) => s.aspectRatio);
  const setAspectRatio = useStudio((s) => s.setAspectRatio);
  const resolution = useStudio((s) => s.resolution);
  const setResolution = useStudio((s) => s.setResolution);
  const enqueueBatch = useStudio((s) => s.enqueueBatch);
  const jobs = useStudio((s) => s.jobs);
  const themeHistory = useStudio((s) => s.themeHistory);
  const pushThemeHistory = useStudio((s) => s.pushThemeHistory);
  const enhanceLevel = useStudio((s) => s.enhanceLevel);
  const setEnhanceLevel = useStudio((s) => s.setEnhanceLevel);
  const characterLock = useStudio((s) => s.characterLock);
  const setCharacterLock = useStudio((s) => s.setCharacterLock);
  const groupFilter = useStudio((s) => s.groupFilter);
  const subjectNonce = useStudio((s) => s.subjectNonce);
  const [preview, setPreview] = useState<string | null>(userImageRef.current);
  const [busy, setBusy] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [undoTheme, setUndoTheme] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const running = jobs.filter((j) => j.status === "queued" || j.status === "running").length;
  const currentAspect = ASPECT_OPTIONS.find((o) => o.id === aspectRatio) ?? ASPECT_OPTIONS[0];
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const mod = isMac ? "⌘" : "Ctrl";

  useEffect(() => {
    setPreview(userImageRef.current);
  }, [subjectNonce]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const cap = window.matchMedia("(min-width: 1024px)").matches ? 96 : 168;
    el.style.height = `${Math.min(el.scrollHeight, cap)}px`;
  }, [theme]);

  async function onFile(file: File, source: "pick" | "paste" | "drop" = "pick") {
    if (!file.type.startsWith("image/")) {
      toast.error(lang === "vi" ? "Chỉ nhận file ảnh" : "Images only");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const resized = await resizeImageDataUrl(String(reader.result));
        setSubjectDataUrl(resized);
        setPreview(resized);
        if (source === "paste") toast.success(copy.pastedImage);
        try {
          const { w, h } = await imageSizeFromDataUrl(resized);
          const next = nearestAspect(w, h);
          const skewed = w / h < 0.85 || w / h > 1.18;
          if (skewed && aspectRatio === "1:1" && next !== "1:1") {
            setAspectRatio(next);
            toast.message(copy.aspectFromImage(next));
          }
        } catch {
          /* ignore */
        }
      } catch {
        toast.error(lang === "vi" ? "Không đọc được ảnh" : "Could not read image");
      }
    };
    reader.readAsDataURL(file);
  }

  async function generate() {
    if (!theme.trim()) {
      toast.error(copy.needTheme);
      return;
    }
    if (selected.length === 0) {
      toast.error(copy.needStyle);
      return;
    }
    if (selected.length > MAX_BATCH) {
      toast.error(copy.maxBatch(MAX_BATCH));
      return;
    }
    setBusy(true);
    try {
      const avail = await checkAiAvailable();
      if (!avail.available) {
        toast.error(copy.aiUnavailable);
        return;
      }
      pushThemeHistory(theme);
      const result = enqueueBatch(userImageRef.current ?? undefined);
      if (!result.ok) {
        const key = result.error;
        toast.error(key === "needTheme" || key === "needStyle" ? copy[key] : result.error);
        return;
      }
      toast.success(
        lang === "vi" ? `Đã xếp ${result.count} việc vào hàng đợi` : `Queued ${result.count} jobs`,
      );
    } finally {
      setBusy(false);
    }
  }

  async function enhance(level: EnhanceLevel = enhanceLevel) {
    if (!theme.trim() && !preview) {
      toast.error(copy.enhanceNeed);
      areaRef.current?.focus();
      return;
    }
    setEnhancing(true);
    try {
      const vision = preview ? await resizeImageDataUrl(preview, 768, 0.8) : undefined;
      const result = await enhanceTheme({
        data: { theme, lang, level, userImageDataUrl: vision },
      });
      if (!result.ok) {
        toast.error(result.error === "needTheme" ? copy.enhanceNeed : copy.enhanceFail);
        return;
      }
      if (result.theme === theme.trim()) {
        toast.message(lang === "vi" ? "Chủ đề đã đủ rõ." : "Theme is already clear.");
        return;
      }
      pushThemeHistory(theme);
      setUndoTheme(theme);
      setTheme(result.theme);
      toast.success(copy.enhanceDone);
    } catch {
      toast.error(copy.enhanceFail);
    } finally {
      setEnhancing(false);
    }
  }

  function undo() {
    if (undoTheme == null) return;
    setTheme(undoTheme);
    setUndoTheme(null);
  }

  function surprise() {
    const groups = [
      ...new Set(
        selected
          .map((n) => getStyle(n)?.groupId)
          .filter((g): g is StyleGroupId => Boolean(g)),
      ),
    ];
    const fromFilter = groupFilter !== "all" ? [groupFilter] : [];
    const spark = pickSpark(lang, groups.length ? groups : fromFilter, theme);
    if (theme.trim()) {
      pushThemeHistory(theme);
      setUndoTheme(theme);
    }
    setTheme(spark);
  }

  const n = Math.min(selected.length, MAX_BATCH);
  const generateLabel = busy || running > 0 ? copy.generating : n > 0 ? copy.generateN(n) : copy.generate;
  const levels: { id: EnhanceLevel; label: string; hint: string }[] = [
    { id: "short", label: copy.enhanceShort, hint: copy.enhanceShortHint },
    { id: "full", label: copy.enhanceFull, hint: copy.enhanceFullHint },
    { id: "cinematic", label: copy.enhanceCinematic, hint: copy.enhanceCinematicHint },
  ];

  const enhanceBtn = (surface: "ink" | "paper") => (
    <div
      className={cn(
        "inline-flex overflow-hidden",
        surface === "ink" ? "rounded-full" : "rounded-md shadow-[var(--shadow-border)]",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled={enhancing}
            onClick={() => void enhance()}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-90 disabled:opacity-40",
              surface === "ink" ? "h-9 bg-ink px-3 text-bg" : "h-11 bg-surface px-2.5 text-ink",
            )}
            aria-label={copy.enhance}
          >
            {enhancing ? <Loader2 className="size-3.5 animate-spin" /> : <WandSparkles className="size-3.5" />}
            {surface === "ink" ? (enhancing ? copy.enhancing : copy.enhance) : null}
          </button>
        </TooltipTrigger>
        <TooltipContent>{copy.enhanceHint}</TooltipContent>
      </Tooltip>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center border-l border-white/20",
              surface === "ink" ? "h-9 w-7 bg-ink text-bg" : "h-11 w-8 bg-surface text-ink-muted",
            )}
            aria-label={copy.enhanceFull}
          >
            <ChevronDown className="size-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <p className="mb-2 text-xs font-medium text-ink-muted">{copy.enhance}</p>
          <div className="flex flex-col gap-1">
            {levels.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setEnhanceLevel(item.id);
                  void enhance(item.id);
                }}
                className={cn(
                  "rounded-md px-2 py-2 text-left",
                  enhanceLevel === item.id ? "bg-ink text-bg" : "hover:bg-stamp-soft",
                )}
              >
                <span className="block text-sm font-medium">{item.label}</span>
                <span className={cn("block text-xs", enhanceLevel === item.id ? "text-bg/70" : "text-ink-subtle")}>
                  {item.hint}
                </span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  const surpriseBtn = (size: "sm" | "md") => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={surprise}
          className={cn(
            "inline-flex items-center justify-center bg-surface text-ink-muted shadow-[var(--shadow-border)] hover:text-ink",
            size === "sm" ? "size-12 rounded-lg" : "size-11 rounded-md",
          )}
          aria-label={copy.surprise}
        >
          <Shuffle className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{copy.surpriseHint}</TooltipContent>
    </Tooltip>
  );

  const lockBtn = (size: "sm" | "md") => (
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

  const historyBtn = (size: "sm" | "md") =>
    themeHistory.length > 0 ? (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center bg-surface text-ink-muted shadow-[var(--shadow-border)] hover:text-ink",
              size === "sm" ? "size-9 rounded-full" : "size-11 rounded-md",
            )}
            aria-label={copy.history}
          >
            <Clock3 className="size-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <p className="mb-2 text-xs font-medium text-ink-muted">{copy.history}</p>
          <ul className="flex max-h-64 flex-col gap-1 overflow-auto">
            {themeHistory.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => {
                    setUndoTheme(theme);
                    setTheme(item);
                  }}
                  className="line-clamp-3 w-full rounded-md px-2 py-2 text-left text-sm leading-snug text-ink hover:bg-stamp-soft"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    ) : null;

  const undoBtn = (size: "sm" | "md") =>
    undoTheme != null ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={undo}
            className={cn(
              "inline-flex items-center justify-center bg-surface text-ink-muted shadow-[var(--shadow-border)] hover:text-ink",
              size === "sm" ? "size-9 rounded-full" : "size-11 rounded-md",
            )}
            aria-label={copy.undoEnhance}
          >
            <Undo2 className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{copy.undoEnhance}</TooltipContent>
      </Tooltip>
    ) : null;

  const attachControl = preview ? (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg shadow-[var(--shadow-border)] lg:size-11 lg:rounded-md">
      <img src={preview} alt="" className="img-outline size-full object-cover" />
      <button
        type="button"
        onClick={() => {
          clearSubject();
          setPreview(null);
        }}
        className="absolute inset-0 flex items-center justify-center bg-ink/50 text-bg"
        aria-label={copy.removeImage}
      >
        <X className="size-4" />
      </button>
    </div>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-line-strong bg-surface text-ink-muted hover:border-stamp hover:text-ink lg:size-11 lg:rounded-md"
          aria-label={copy.attach}
        >
          <ImagePlus className="size-5 lg:size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{copy.attachHint}</TooltipContent>
    </Tooltip>
  );

  const ratioControl = (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-12 min-w-12 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-surface px-3 text-sm font-medium text-ink shadow-[var(--shadow-border)] lg:h-11 lg:rounded-md lg:px-2.5 lg:text-xs"
          aria-label={copy.aspect}
        >
          <RatioGlyph w={currentAspect.w} h={currentAspect.h} />
          <span className="tabular-nums">{currentAspect.label}</span>
          <ChevronDown className="size-3.5 text-ink-subtle" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p className="mb-2 text-xs font-medium text-ink-muted">{copy.aspect}</p>
        <div className="grid grid-cols-4 gap-1.5">
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAspectRatio(opt.id)}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 rounded-md text-xs",
                aspectRatio === opt.id ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted hover:text-ink",
              )}
            >
              <RatioGlyph w={opt.w} h={opt.h} />
              {opt.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  const resolutionControl = (
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

  const chips =
    selected.length > 0 ? (
      <div className="chip-scroll flex gap-1.5 overflow-x-auto">
        {selected.map((num) => {
          const style = getStyle(num);
          return (
            <button
              key={num}
              type="button"
              onClick={() => toggleStyle(num)}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-surface pr-2 pl-0.5 shadow-[var(--shadow-border)]"
            >
              {style ? (
                <img src={style.previewUrl} alt="" className="size-7 rounded-full object-cover" />
              ) : null}
              <span className="font-mono text-xs text-stamp tabular-nums">#{num}</span>
              <X className="size-3 text-ink-subtle" />
            </button>
          );
        })}
      </div>
    ) : null;

  return (
    <section className="shrink-0 border-t border-line bg-bg-elevated/95 backdrop-blur-md lg:border-t-0 lg:border-b">
      <div className="flex flex-col gap-2.5 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-5 lg:py-2.5">
        {chips}
        <label htmlFor="theme-input" className="sr-only">
          {copy.themeLabel}
        </label>
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div
            className={cn(
              "relative lg:min-w-0 lg:flex-1",
              dragging && "rounded-lg ring-2 ring-stamp ring-offset-2 ring-offset-bg",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) void onFile(file, "drop");
            }}
          >
            <Textarea
              id="theme-input"
              ref={areaRef}
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                if (undoTheme != null) setUndoTheme(null);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onPaste={(e) => {
                const file = extractClipboardImage(e);
                if (!file) return;
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain").trim();
                void onFile(file, "paste");
                if (text && !theme.trim()) setTheme(text);
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  void generate();
                }
                if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "e") {
                  e.preventDefault();
                  void enhance();
                }
              }}
              placeholder={copy.themePlaceholder}
              title={`${copy.pasteHint.replace("Ctrl", mod)} · ${copy.generateKbd.replace("Ctrl", mod)}`}
              rows={3}
              className="min-h-28 w-full px-3.5 pt-3 pb-11 text-base leading-relaxed lg:h-11 lg:min-h-11 lg:max-h-24 lg:py-2.5 lg:pr-3 lg:pb-2.5 lg:text-sm"
              aria-label={copy.themeLabel}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1 lg:hidden">
              {undoBtn("sm")}
              {enhanceBtn("ink")}
            </div>
            {focused && !preview && !theme.trim() ? (
              <p className="pointer-events-none absolute bottom-3 left-3 max-w-[40%] truncate text-[0.65rem] text-ink-subtle lg:hidden">
                {copy.pasteHint.replace("Ctrl", mod)}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex">{surpriseBtn("md")}</span>
            <span className="hidden lg:inline-flex">{historyBtn("md")}</span>
            <span className="hidden lg:inline-flex">{undoBtn("md")}</span>
            <span className="hidden lg:inline-flex">{enhanceBtn("paper")}</span>
            {attachControl}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onFile(file);
                e.target.value = "";
              }}
            />
            {ratioControl}
            {resolutionControl}
            <span className="hidden lg:inline-flex">{lockBtn("md")}</span>
            <Button
              className="hidden h-11 shrink-0 px-4 lg:inline-flex"
              disabled={busy || n === 0}
              onClick={() => void generate()}
            >
              <Sparkles className="size-4" />
              {generateLabel}
            </Button>
          </div>
          <div className="flex gap-2 lg:hidden">
            {lockBtn("sm")}
            {surpriseBtn("sm")}
            <Button
              className="h-12 min-w-0 flex-1 text-base"
              disabled={busy || n === 0}
              onClick={() => void generate()}
            >
              <Sparkles className="size-4" />
              {generateLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RatioGlyph({ w, h }: { w: number; h: number }) {
  const max = Math.max(w, h);
  return (
    <span
      className="inline-block rounded-[1px] border border-current opacity-80"
      style={{
        width: `${6 + (w / max) * 10}px`,
        height: `${6 + (h / max) * 10}px`,
      }}
    />
  );
}
