import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, Clapperboard, Clock3, ImageIcon, ImagePlus, Loader2, Shuffle, Undo2, WandSparkles, X } from "lucide-react";
import { toast } from "sonner";
import { ColorControl, CopiesControl, LockControl, RatioControl, ResolutionControl } from "@/components/studio/compose-batch";
import { LayoutGrid } from "@/components/studio/layout-grid";
import { StoredImage } from "@/components/studio/stored-image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getStyle } from "@/lib/studio/catalog";
import { getColor } from "@/lib/studio/color-catalog";
import { enhanceTheme } from "@/lib/studio/enhance";
import { checkAiAvailable } from "@/lib/studio/generate";
import { getLayout } from "@/lib/studio/layout-catalog";
import { t } from "@/lib/studio/i18n";
import { userImageRef } from "@/lib/studio/session";
import { pickSpark } from "@/lib/studio/sparks";
import { useStudio } from "@/lib/studio/store";
import { clearSubject, setSubjectDataUrl } from "@/lib/studio/subject";
import { MAX_BATCH, VIDEO_DURATION_MAX, VIDEO_DURATION_MIN, type EnhanceLevel, type StyleGroupId } from "@/lib/studio/types";
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
  const aspectRatio = useStudio((s) => s.aspectRatio);
  const setAspectRatio = useStudio((s) => s.setAspectRatio);
  const resolution = useStudio((s) => s.resolution);
  const enqueueBatch = useStudio((s) => s.enqueueBatch);
  const jobs = useStudio((s) => s.jobs);
  const themeHistory = useStudio((s) => s.themeHistory);
  const pushThemeHistory = useStudio((s) => s.pushThemeHistory);
  const enhanceLevel = useStudio((s) => s.enhanceLevel);
  const setEnhanceLevel = useStudio((s) => s.setEnhanceLevel);
  const copiesPerStyle = useStudio((s) => s.copiesPerStyle);
  const characterLock = useStudio((s) => s.characterLock);
  const layoutId = useStudio((s) => s.layoutId);
  const setLayoutId = useStudio((s) => s.setLayoutId);
  const colorId = useStudio((s) => s.colorId);
  const composeMode = useStudio((s) => s.composeMode);
  const setComposeMode = useStudio((s) => s.setComposeMode);
  const videoPick = useStudio((s) => s.videoPick);
  const videoPrompt = useStudio((s) => s.videoPrompt);
  const setVideoPrompt = useStudio((s) => s.setVideoPrompt);
  const videoDuration = useStudio((s) => s.videoDuration);
  const setVideoDuration = useStudio((s) => s.setVideoDuration);
  const toggleVideoPick = useStudio((s) => s.toggleVideoPick);
  const gallery = useStudio((s) => s.gallery);
  const enqueueVideos = useStudio((s) => s.enqueueVideos);
  const groupFilter = useStudio((s) => s.groupFilter);
  const subjectNonce = useStudio((s) => s.subjectNonce);
  const [preview, setPreview] = useState<string | null>(userImageRef.current);
  const [busy, setBusy] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [undoTheme, setUndoTheme] = useState<string | null>(null);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const running = jobs.filter((j) => j.status === "queued" || j.status === "running").length;
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const mod = isMac ? "⌘" : "Ctrl";
  const layout = getLayout(layoutId);
  const color = getColor(colorId);
  const videoMode = composeMode === "video";

  useEffect(() => {
    setPreview(userImageRef.current);
  }, [subjectNonce]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const cap = window.matchMedia("(min-width: 1024px)").matches ? 160 : 180;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 44), cap)}px`;
  }, [theme, videoPrompt, videoMode]);

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
      const result = await enqueueBatch(userImageRef.current ?? undefined);
      if (!result.ok) {
        const key = result.error;
        toast.error(
          key === "needTheme" || key === "needStyle" || key === "inFlight" ? copy[key] : result.error,
        );
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

  async function makeVideos() {
    if (!videoPrompt.trim() || videoStills.length === 0) {
      toast.error(copy.videoNeed);
      return;
    }
    setBusy(true);
    try {
      const avail = await checkAiAvailable();
      if (!avail.available) {
        toast.error(copy.aiUnavailable);
        return;
      }
      const result = await enqueueVideos();
      if (!result.ok) {
        toast.error(copy.videoNeed);
        return;
      }
      toast.success(copy.videoQueued(result.count));
    } finally {
      setBusy(false);
    }
  }

  const n = Math.min(selected.length, MAX_BATCH) * copiesPerStyle;
  const generateLabel = busy || running > 0 ? copy.generating : n > 0 ? copy.generateN(n) : copy.generate;
  const levels: { id: EnhanceLevel; label: string; hint: string }[] = [
    { id: "short", label: copy.enhanceShort, hint: copy.enhanceShortHint },
    { id: "full", label: copy.enhanceFull, hint: copy.enhanceFullHint },
    { id: "cinematic", label: copy.enhanceCinematic, hint: copy.enhanceCinematicHint },
  ];
  const layoutName = layout ? (lang === "vi" ? layout.nameVi : layout.nameEn) : copy.layoutNone;
  const videoStills = gallery.filter((g) => videoPick.includes(g.id) && g.kind !== "video");
  const summary = videoMode
    ? aspectRatio
    : [
        aspectRatio,
        resolution.toUpperCase(),
        copiesPerStyle > 1 ? `×${copiesPerStyle}` : null,
        layout?.id,
        color?.id,
        characterLock ? copy.characterLock : null,
      ]
        .filter(Boolean)
        .join(" · ");

  const iconBtn =
    "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-bg hover:text-ink disabled:opacity-40";

  return (
    <section className="shrink-0 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-4 lg:pb-4">
      <label htmlFor="theme-input" className="sr-only">
        {copy.themeLabel}
      </label>
      <div
        className={cn(
          "cursor-text rounded-[28px] bg-surface p-2 shadow-[var(--shadow-border)]",
          dragging && "ring-2 ring-stamp",
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) areaRef.current?.focus();
        }}
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
        {videoMode ? (
          videoStills.length > 0 ? (
            <div className="mb-1 flex gap-1.5 overflow-x-auto px-1">
              {videoStills.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleVideoPick(item.id)}
                  className="relative shrink-0"
                  aria-label={copy.clear}
                >
                  <StoredImage id={item.id} alt="" className="size-12 rounded-xl" />
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-ink text-bg">
                    <X className="size-2.5" />
                  </span>
                </button>
              ))}
            </div>
          ) : null
        ) : preview ? (
          <div className="mb-1 ml-1 w-fit">
            <div className="relative size-14">
              <img src={preview} alt="" className="img-outline size-14 rounded-2xl object-cover" />
              <button
                type="button"
                onClick={() => {
                  clearSubject();
                  setPreview(null);
                }}
                className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-ink text-bg"
                aria-label={copy.removeImage}
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        ) : null}
        <textarea
          id="theme-input"
          ref={areaRef}
          value={videoMode ? videoPrompt : theme}
          onChange={(e) => {
            if (videoMode) setVideoPrompt(e.target.value);
            else {
              setTheme(e.target.value);
              if (undoTheme != null) setUndoTheme(null);
            }
          }}
          onPaste={(e) => {
            const file = extractClipboardImage(e);
            if (!file) return;
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain").trim();
            void onFile(file, "paste");
            if (text && !theme.trim()) setTheme(text);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              if (videoMode) void makeVideos();
              else void generate();
            }
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "e") {
              e.preventDefault();
              void enhance();
            }
          }}
          placeholder={videoMode ? copy.videoPlaceholder : copy.themePlaceholder}
          title={`${copy.pasteHint.replace("Ctrl", mod)}`}
          rows={1}
          className="max-h-44 min-h-11 w-full resize-none border-0 bg-transparent px-2 py-1.5 text-base leading-relaxed text-ink outline-none placeholder:text-ink-subtle focus:outline-none lg:text-sm"
          aria-label={copy.themeLabel}
        />
        <div className="flex items-center gap-0.5 px-0.5 pt-1">
          <div className="flex h-8 shrink-0 items-center rounded-full bg-bg p-0.5">
            <button
              type="button"
              onClick={() => setComposeMode("image")}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-full px-2 text-xs font-medium",
                videoMode ? "text-ink-muted" : "bg-surface text-ink shadow-[var(--shadow-border)]",
              )}
            >
              <ImageIcon className="size-3.5" />
              <span className="hidden sm:inline">{copy.modeImage}</span>
            </button>
            <button
              type="button"
              onClick={() => setComposeMode("video")}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-full px-2 text-xs font-medium",
                videoMode ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-ink-muted",
              )}
            >
              <Clapperboard className="size-3.5" />
              <span className="hidden sm:inline">{copy.modeVideo}</span>
            </button>
          </div>
          {videoMode ? (
            <label className="ml-1 flex h-8 min-w-0 items-center gap-2 rounded-full bg-bg px-2.5">
              <input
                type="range"
                min={VIDEO_DURATION_MIN}
                max={VIDEO_DURATION_MAX}
                step={1}
                value={videoDuration}
                onChange={(e) => setVideoDuration(Number(e.target.value))}
                className="h-1 w-16 cursor-pointer accent-stamp sm:w-28"
                aria-label={copy.videoPrompt}
              />
              <span className="w-7 shrink-0 text-xs text-ink tabular-nums">{videoDuration}s</span>
            </label>
          ) : (
            <>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={() => fileRef.current?.click()} className={iconBtn} aria-label={copy.attach}>
                <ImagePlus className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{copy.attachHint}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={surprise} className={iconBtn} aria-label={copy.surprise}>
                <Shuffle className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{copy.surpriseHint}</TooltipContent>
          </Tooltip>
          <div className="inline-flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled={enhancing}
                  onClick={() => void enhance()}
                  className={iconBtn}
                  aria-label={copy.enhance}
                >
                  {enhancing ? <Loader2 className="size-4 animate-spin" /> : <WandSparkles className="size-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{copy.enhanceHint}</TooltipContent>
            </Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className={cn(iconBtn, "w-5")} aria-label={copy.enhance}>
                  <ChevronDown className="size-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start">
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
          {undoTheme != null ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={undo} className={iconBtn} aria-label={copy.undoEnhance}>
                  <Undo2 className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{copy.undoEnhance}</TooltipContent>
            </Tooltip>
          ) : null}
          {themeHistory.length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className={iconBtn} aria-label={copy.history}>
                  <Clock3 className="size-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
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
                        className="line-clamp-3 w-full rounded-md px-2 py-2 text-left text-sm leading-snug hover:bg-stamp-soft"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          ) : null}
            </>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="ml-0.5 inline-flex h-8 max-w-[46%] items-center gap-1 truncate rounded-full bg-bg px-2.5 text-xs text-ink-muted hover:text-ink sm:max-w-none"
              >
                <span className="truncate">{summary}</span>
                <ChevronDown className="size-3 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[min(92vw,24rem)]" align="start">
              {videoMode ? (
                <RatioControl />
              ) : (
                <>
              <div className="flex flex-wrap items-center gap-2">
                <RatioControl />
                <ResolutionControl />
                <CopiesControl />
                <ColorControl />
                <LockControl size="sm" />
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => setLayoutOpen(true)}
                  className="min-w-0 flex-1 truncate text-left text-sm"
                >
                  <span className="block text-[10px] tracking-wide text-ink-subtle uppercase">{copy.layouts}</span>
                  <span className="block truncate">{layout ? `${layout.id} · ${layoutName}` : copy.pickLayout}</span>
                </button>
                {layout ? (
                  <button type="button" className="text-xs text-stamp" onClick={() => setLayoutId(null)}>
                    {copy.layoutClear}
                  </button>
                ) : null}
              </div>
                </>
              )}
            </PopoverContent>
          </Popover>

          <button
            type="button"
            disabled={busy || (videoMode ? videoStills.length === 0 || !videoPrompt.trim() : n === 0)}
            onClick={() => void (videoMode ? makeVideos() : generate())}
            className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full bg-stamp text-stamp-fg transition-opacity disabled:bg-line disabled:text-ink-subtle"
            aria-label={videoMode ? copy.videoMake(videoStills.length) : generateLabel}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
          </button>
        </div>
      </div>

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

      <Dialog open={layoutOpen} onOpenChange={setLayoutOpen}>
        <DialogContent className="flex h-[min(88vh,820px)] w-[min(96vw,920px)] flex-col overflow-hidden p-0">
          <DialogTitle className="sr-only">{copy.layouts}</DialogTitle>
          <LayoutGrid onPicked={() => setLayoutOpen(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
