import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { dataUrlToBlob, makeSeed, uid } from "@/lib/utils";
import { getStyle } from "./catalog";
import { buildPrompts, shouldUseStyleReference } from "./prompt";
import { deleteImageBlob, saveImageBlob } from "./idb";
import {
  DEFAULT_CONCURRENCY,
  MAX_BATCH,
  MAX_COPIES,
  MAX_CONCURRENCY,
  MAX_GALLERY_ITEMS,
  MAX_JOBS,
  type AspectRatio,
  type EnhanceLevel,
  type GalleryItem,
  type GenerateJob,
  type JobStatus,
  type Lang,
  type Resolution,
  type StyleGroupId,
} from "./types";

interface StudioState {
  lang: Lang;
  theme: string;
  selected: string[];
  aspectRatio: AspectRatio;
  resolution: Resolution;
  concurrency: number;
  paused: boolean;
  search: string;
  groupFilter: StyleGroupId | "all";
  onlyFavorites: boolean;
  styleFavorites: string[];
  jobs: GenerateJob[];
  gallery: GalleryItem[];
  activeJobId: string | null;
  lightboxId: string | null;
  durations: number[];
  themeHistory: string[];
  subjectNonce: number;
  studioTab: "styles" | "results";
  characterLock: boolean;
  enhanceLevel: EnhanceLevel;
  copiesPerStyle: number;

  setLang: (lang: Lang) => void;
  setTheme: (theme: string) => void;
  toggleStyle: (number: string) => void;
  setSelected: (numbers: string[]) => void;
  clearSelected: () => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setResolution: (res: Resolution) => void;
  setConcurrency: (n: number) => void;
  setPaused: (paused: boolean) => void;
  setSearch: (q: string) => void;
  setGroupFilter: (g: StyleGroupId | "all") => void;
  setOnlyFavorites: (v: boolean) => void;
  toggleStyleFavorite: (number: string) => void;
  setActiveJob: (id: string | null) => void;
  setLightbox: (id: string | null) => void;
  pushThemeHistory: (theme: string) => void;
  setSubjectNonce: () => void;
  setStudioTab: (tab: "styles" | "results") => void;
  setCharacterLock: (v: boolean) => void;
  setEnhanceLevel: (level: EnhanceLevel) => void;
  setCopiesPerStyle: (n: number) => void;

  enqueueBatch: (userImageDataUrl?: string) => { ok: true; batchId: string; count: number } | { ok: false; error: string };
  patchJob: (id: string, patch: Partial<GenerateJob>) => void;
  cancelJob: (id: string) => void;
  cancelQueued: () => void;
  retryJob: (id: string) => void;
  retryFailed: () => void;
  addGalleryFromJob: (job: GenerateJob, dataUrl: string) => Promise<void>;
  toggleGalleryFavorite: (id: string) => void;
  deleteGalleryItem: (id: string) => Promise<void>;
  nextQueued: (limit: number) => GenerateJob[];
  runningCount: () => number;
  avgDuration: () => number;
}

function trimGallery(items: GalleryItem[]): GalleryItem[] {
  if (items.length <= MAX_GALLERY_ITEMS) return items;
  return items
    .slice()
    .sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.createdAt - a.createdAt)
    .slice(0, MAX_GALLERY_ITEMS);
}

const savingJobs = new Set<string>();

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      lang: "vi",
      theme: "",
      selected: [],
      aspectRatio: "1:1",
      resolution: "1k",
      concurrency: DEFAULT_CONCURRENCY,
      paused: false,
      search: "",
      groupFilter: "all",
      onlyFavorites: false,
      styleFavorites: [],
      jobs: [],
      gallery: [],
      activeJobId: null,
      lightboxId: null,
      durations: [],
      themeHistory: [],
      subjectNonce: 0,
      studioTab: "styles",
      characterLock: false,
      enhanceLevel: "full",
      copiesPerStyle: 1,

      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      toggleStyle: (number) =>
        set((s) => {
          if (s.selected.includes(number)) {
            return { selected: s.selected.filter((n) => n !== number) };
          }
          if (s.selected.length >= MAX_BATCH) return s;
          return { selected: [...s.selected, number] };
        }),
      setSelected: (numbers) => set({ selected: [...new Set(numbers)].slice(0, MAX_BATCH) }),
      clearSelected: () => set({ selected: [] }),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      setResolution: (resolution) => set({ resolution }),
      setConcurrency: (n) => set({ concurrency: Math.min(MAX_CONCURRENCY, Math.max(1, n)) }),
      setPaused: (paused) => set({ paused }),
      setSearch: (search) => set({ search }),
      setGroupFilter: (groupFilter) => set({ groupFilter }),
      setOnlyFavorites: (onlyFavorites) => set({ onlyFavorites }),
      toggleStyleFavorite: (number) =>
        set((s) => ({
          styleFavorites: s.styleFavorites.includes(number)
            ? s.styleFavorites.filter((n) => n !== number)
            : [...s.styleFavorites, number],
        })),
      setActiveJob: (activeJobId) => set({ activeJobId }),
      setLightbox: (lightboxId) => set({ lightboxId }),
      pushThemeHistory: (theme) =>
        set((s) => {
          const t = theme.trim();
          if (!t) return s;
          return { themeHistory: [t, ...s.themeHistory.filter((x) => x !== t)].slice(0, 8) };
        }),
      setSubjectNonce: () => set((s) => ({ subjectNonce: s.subjectNonce + 1 })),
      setStudioTab: (studioTab) => set({ studioTab }),
      setCharacterLock: (characterLock) => set({ characterLock }),
      setEnhanceLevel: (enhanceLevel) => set({ enhanceLevel }),
      setCopiesPerStyle: (n) => set({ copiesPerStyle: Math.min(MAX_COPIES, Math.max(1, Math.round(n))) }),

      enqueueBatch: (userImageDataUrl) => {
        const s = get();
        const theme = s.theme.trim();
        if (!theme) return { ok: false, error: "needTheme" };
        if (s.selected.length === 0) return { ok: false, error: "needStyle" };
        const pick = s.selected.slice(0, MAX_BATCH);
        const copies = Math.min(MAX_COPIES, Math.max(1, s.copiesPerStyle));
        const batchId = uid("batch");
        const now = Date.now();
        const useStyleRef = shouldUseStyleReference();
        const lock = s.characterLock && (pick.length > 1 || copies > 1);
        const jobs: GenerateJob[] = [];
        let blocked = 0;
        let seq = 0;
        pick.forEach((number) => {
          const style = getStyle(number);
          if (!style) return;
          const inFlight = s.jobs.filter(
            (j) =>
              (j.status === "queued" || j.status === "running") &&
              j.styleNumber === number &&
              j.theme === theme &&
              j.aspectRatio === s.aspectRatio,
          ).length;
          const toAdd = Math.min(copies, MAX_COPIES - inFlight);
          if (toAdd <= 0) {
            blocked += 1;
            return;
          }
          for (let c = 0; c < toAdd; c++) {
            const waitsForAnchor = lock && !userImageDataUrl && seq > 0;
            const hasUserImage = Boolean(userImageDataUrl) || waitsForAnchor;
            const seed = makeSeed();
            const prompts = buildPrompts({
              style,
              theme,
              aspectRatio: s.aspectRatio,
              hasUserImage,
              useStyleRef,
              characterLock: lock,
              copyIndex: c + 1,
              copies: toAdd,
              seed,
            });
            jobs.push({
              id: uid("job"),
              batchId,
              styleNumber: style.number,
              styleName: style.generationName,
              theme,
              promptEn: prompts.en,
              promptZh: prompts.zh,
              aspectRatio: s.aspectRatio,
              resolution: s.resolution,
              hasUserImage,
              usedStyleRef: useStyleRef,
              status: "queued",
              createdAt: now + seq,
              retryCount: 0,
              characterLock: lock,
              waitsForAnchor,
              copyIndex: c + 1,
              copies: toAdd,
              seed,
            });
            seq += 1;
          }
        });
        if (jobs.length === 0) return { ok: false, error: blocked > 0 ? "inFlight" : "needStyle" };
        set((prev) => ({ jobs: [...jobs, ...prev.jobs].slice(0, MAX_JOBS), paused: false }));
        void import("./queue").then((m) => m.wakeQueue());
        return { ok: true, batchId, count: jobs.length };
      },

      patchJob: (id, patch) =>
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),

      cancelJob: (id) =>
        set((s) => ({
          jobs: s.jobs.map((j) =>
            j.id === id && (j.status === "queued" || j.status === "running")
              ? { ...j, status: "cancelled" as JobStatus, finishedAt: Date.now() }
              : j,
          ),
        })),

      cancelQueued: () =>
        set((s) => ({
          jobs: s.jobs.map((j) =>
            j.status === "queued"
              ? { ...j, status: "cancelled" as JobStatus, finishedAt: Date.now() }
              : j,
          ),
        })),

      retryJob: (id) => {
        set((s) => ({
          paused: false,
          jobs: s.jobs.map((j) =>
            j.id === id && (j.status === "error" || j.status === "cancelled")
              ? {
                  ...j,
                  status: "queued" as JobStatus,
                  error: undefined,
                  retryCount: j.retryCount + 1,
                  startedAt: undefined,
                  finishedAt: undefined,
                  imageId: undefined,
                  seed: makeSeed(),
                }
              : j,
          ),
        }));
        void import("./queue").then((m) => m.wakeQueue());
      },

      retryFailed: () => {
        set((s) => ({
          paused: false,
          jobs: s.jobs.map((j) =>
            j.status === "error"
              ? {
                  ...j,
                  status: "queued" as JobStatus,
                  error: undefined,
                  retryCount: j.retryCount + 1,
                  startedAt: undefined,
                  finishedAt: undefined,
                  imageId: undefined,
                  seed: makeSeed(),
                }
              : j,
          ),
        }));
        void import("./queue").then((m) => m.wakeQueue());
      },

      addGalleryFromJob: async (job, dataUrl) => {
        if (savingJobs.has(job.id)) return;
        const current = get().jobs.find((j) => j.id === job.id);
        if (current?.status === "done" && current.imageId) return;
        if (get().gallery.some((g) => g.jobId === job.id)) {
          set((s) => ({
            jobs: s.jobs.map((j) =>
              j.id === job.id && !j.imageId
                ? {
                    ...j,
                    status: "done" as JobStatus,
                    imageId: s.gallery.find((g) => g.jobId === job.id)?.id,
                    finishedAt: j.finishedAt ?? Date.now(),
                  }
                : j,
            ),
          }));
          return;
        }
        savingJobs.add(job.id);
        try {
          const imageId = uid("img");
          await saveImageBlob(imageId, dataUrlToBlob(dataUrl));
          const item: GalleryItem = {
            id: imageId,
            jobId: job.id,
            batchId: job.batchId,
            styleNumber: job.styleNumber,
            styleName: job.styleName,
            theme: job.theme,
            aspectRatio: job.aspectRatio,
            createdAt: Date.now(),
            favorite: false,
            promptEn: job.promptEn,
          };
          set((s) => {
            if (s.gallery.some((g) => g.jobId === job.id)) {
              return {
                jobs: s.jobs.map((j) =>
                  j.id === job.id
                    ? {
                        ...j,
                        status: "done" as JobStatus,
                        imageId: j.imageId ?? s.gallery.find((g) => g.jobId === job.id)?.id,
                        finishedAt: j.finishedAt ?? Date.now(),
                      }
                    : j,
                ),
              };
            }
            const gallery = trimGallery([item, ...s.gallery]);
            const dropped = s.gallery.filter((g) => !gallery.some((x) => x.id === g.id));
            for (const d of dropped) void deleteImageBlob(d.id);
            return {
              gallery,
              jobs: s.jobs.map((j) =>
                j.id === job.id
                  ? { ...j, status: "done" as JobStatus, imageId, finishedAt: Date.now() }
                  : j,
              ),
              durations: job.startedAt
                ? [...s.durations, Date.now() - job.startedAt].slice(-20)
                : s.durations,
            };
          });
        } finally {
          savingJobs.delete(job.id);
        }
      },

      toggleGalleryFavorite: (id) =>
        set((s) => ({
          gallery: s.gallery.map((g) => (g.id === id ? { ...g, favorite: !g.favorite } : g)),
        })),

      deleteGalleryItem: async (id) => {
        await deleteImageBlob(id);
        set((s) => ({
          gallery: s.gallery.filter((g) => g.id !== id),
          lightboxId: s.lightboxId === id ? null : s.lightboxId,
        }));
      },

      nextQueued: (limit) => get().jobs.filter((j) => j.status === "queued").slice(0, limit),
      runningCount: () => get().jobs.filter((j) => j.status === "running").length,
      avgDuration: () => {
        const d = get().durations;
        if (!d.length) return 28000;
        return d.reduce((a, b) => a + b, 0) / d.length;
      },
    }),
    {
      name: "handraw-studio-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<StudioState>;
        return {
          ...current,
          ...p,
          jobs: current.jobs,
          paused: false,
          activeJobId: current.activeJobId,
          lightboxId: current.lightboxId,
          studioTab: current.studioTab,
          search: current.search,
          themeHistory: p.themeHistory ?? [],
          characterLock: p.characterLock ?? false,
          enhanceLevel:
            p.enhanceLevel === "short" || p.enhanceLevel === "cinematic" ? p.enhanceLevel : "full",
          copiesPerStyle:
            typeof p.copiesPerStyle === "number"
              ? Math.min(MAX_COPIES, Math.max(1, Math.round(p.copiesPerStyle)))
              : 1,
          gallery: Array.isArray(p.gallery) ? p.gallery : current.gallery,
        };
      },
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        selected: s.selected,
        aspectRatio: s.aspectRatio,
        resolution: s.resolution,
        concurrency: s.concurrency,
        styleFavorites: s.styleFavorites,
        gallery: s.gallery,
        durations: s.durations,
        themeHistory: s.themeHistory,
        characterLock: s.characterLock,
        enhanceLevel: s.enhanceLevel,
        copiesPerStyle: s.copiesPerStyle,
      }),
    },
  ),
);
