import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { E as shouldUseStyleReference, O as uid, _ as getLayout, c as cn, g as getColor, s as buildPrompts, u as dataUrlToBlob, v as getStyle, x as makeSeed } from "./utils-V5r_Ws4e.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { b as Images, i as TriangleAlert, v as LayoutGrid, y as Languages } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CpCNZqBL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Imagine edits: `image` is a URL string or string[]; objects `{url,type}` only work as a single `image`. */
var generateStyledImage = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("d23950bc48f6fb0181df135e34b5c0c093e51e1b3dd59cf4b814ced3b94ccf26"));
var checkAiAvailable = createServerFn({ method: "POST" }).handler(createSsrRpc("9954c43fd601ae948e4679f42e17f11705eab224b805183bbfa7d935436c25eb"));
var userImageRef = { current: null };
var DB_NAME = "handraw-studio";
var DB_VERSION = 1;
var STORE = "images";
var urlCache = /* @__PURE__ */ new Map();
var listeners = /* @__PURE__ */ new Set();
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("idb open failed"));
	});
}
function notify(id) {
	listeners.forEach((fn) => fn(id));
}
function subscribeImageCache(listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
async function saveImageBlob(id, blob) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(blob, id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("idb put failed"));
	});
	const prev = urlCache.get(id);
	if (prev) URL.revokeObjectURL(prev);
	urlCache.set(id, URL.createObjectURL(blob));
	notify(id);
}
async function getImageBlob(id) {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("idb get failed"));
	});
}
async function deleteImageBlob(id) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).delete(id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("idb delete failed"));
	});
	const prev = urlCache.get(id);
	if (prev) URL.revokeObjectURL(prev);
	urlCache.delete(id);
	notify(id);
}
async function getImageObjectUrl(id) {
	const cached = urlCache.get(id);
	if (cached) return cached;
	const blob = await getImageBlob(id);
	if (!blob) return void 0;
	const url = URL.createObjectURL(blob);
	urlCache.set(id, url);
	return url;
}
function peekImageObjectUrl(id) {
	return urlCache.get(id);
}
function trimGallery(items) {
	if (items.length <= 120) return items;
	return items.slice().sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.createdAt - a.createdAt).slice(0, 120);
}
var savingJobs = /* @__PURE__ */ new Set();
var useStudio = create()(persist((set, get) => ({
	lang: "vi",
	theme: "",
	selected: [],
	aspectRatio: "1:1",
	resolution: "1k",
	concurrency: 2,
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
	layoutId: null,
	colorId: null,
	setLang: (lang) => set({ lang }),
	setTheme: (theme) => set({ theme }),
	toggleStyle: (number) => set((s) => {
		if (s.selected.includes(number)) return { selected: s.selected.filter((n) => n !== number) };
		if (s.selected.length >= 12) return s;
		return { selected: [...s.selected, number] };
	}),
	setSelected: (numbers) => set({ selected: [...new Set(numbers)].slice(0, 12) }),
	clearSelected: () => set({ selected: [] }),
	setAspectRatio: (aspectRatio) => set({ aspectRatio }),
	setResolution: (resolution) => set({ resolution }),
	setConcurrency: (n) => set({ concurrency: Math.min(4, Math.max(1, n)) }),
	setPaused: (paused) => set({ paused }),
	setSearch: (search) => set({ search }),
	setGroupFilter: (groupFilter) => set({ groupFilter }),
	setOnlyFavorites: (onlyFavorites) => set({ onlyFavorites }),
	toggleStyleFavorite: (number) => set((s) => ({ styleFavorites: s.styleFavorites.includes(number) ? s.styleFavorites.filter((n) => n !== number) : [...s.styleFavorites, number] })),
	setActiveJob: (activeJobId) => set({ activeJobId }),
	setLightbox: (lightboxId) => set({ lightboxId }),
	pushThemeHistory: (theme) => set((s) => {
		const t = theme.trim();
		if (!t) return s;
		return { themeHistory: [t, ...s.themeHistory.filter((x) => x !== t)].slice(0, 8) };
	}),
	setSubjectNonce: () => set((s) => ({ subjectNonce: s.subjectNonce + 1 })),
	setStudioTab: (studioTab) => set({ studioTab }),
	setCharacterLock: (characterLock) => set({ characterLock }),
	setEnhanceLevel: (enhanceLevel) => set({ enhanceLevel }),
	setCopiesPerStyle: (n) => set({ copiesPerStyle: Math.min(5, Math.max(1, Math.round(n))) }),
	setLayoutId: (layoutId) => set({ layoutId }),
	setColorId: (colorId) => set({ colorId }),
	enqueueBatch: (userImageDataUrl) => {
		const s = get();
		const theme = s.theme.trim();
		if (!theme) return {
			ok: false,
			error: "needTheme"
		};
		if (s.selected.length === 0) return {
			ok: false,
			error: "needStyle"
		};
		const pick = s.selected.slice(0, 12);
		const copies = Math.min(5, Math.max(1, s.copiesPerStyle));
		const batchId = uid("batch");
		const now = Date.now();
		const useStyleRef = shouldUseStyleReference();
		const layout = getLayout(s.layoutId);
		const color = getColor(s.colorId);
		const lock = s.characterLock && (pick.length > 1 || copies > 1);
		const jobs = [];
		let blocked = 0;
		let seq = 0;
		pick.forEach((number) => {
			const style = getStyle(number);
			if (!style) return;
			const inFlight = s.jobs.filter((j) => (j.status === "queued" || j.status === "running") && j.styleNumber === number && j.theme === theme && j.aspectRatio === s.aspectRatio && (j.layoutId ?? null) === (layout?.id ?? null) && (j.colorId ?? null) === (color?.id ?? null)).length;
			const toAdd = Math.min(copies, 5 - inFlight);
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
					layout,
					color
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
					layoutId: layout?.id,
					layoutName: layout ? s.lang === "vi" ? layout.nameVi : layout.nameEn : void 0,
					colorId: color?.id,
					colorName: color ? s.lang === "vi" ? color.nameVi : color.nameEn : void 0
				});
				seq += 1;
			}
		});
		if (jobs.length === 0) return {
			ok: false,
			error: blocked > 0 ? "inFlight" : "needStyle"
		};
		set((prev) => ({
			jobs: [...jobs, ...prev.jobs].slice(0, 80),
			paused: false
		}));
		import("./queue-DcBFgZhp.mjs").then((m) => m.wakeQueue());
		return {
			ok: true,
			batchId,
			count: jobs.length
		};
	},
	patchJob: (id, patch) => set((s) => ({ jobs: s.jobs.map((j) => j.id === id ? {
		...j,
		...patch
	} : j) })),
	cancelJob: (id) => set((s) => ({ jobs: s.jobs.map((j) => j.id === id && (j.status === "queued" || j.status === "running") ? {
		...j,
		status: "cancelled",
		finishedAt: Date.now()
	} : j) })),
	cancelQueued: () => set((s) => ({ jobs: s.jobs.map((j) => j.status === "queued" ? {
		...j,
		status: "cancelled",
		finishedAt: Date.now()
	} : j) })),
	retryJob: (id) => {
		set((s) => ({
			paused: false,
			jobs: s.jobs.map((j) => j.id === id && (j.status === "error" || j.status === "cancelled") ? {
				...j,
				status: "queued",
				error: void 0,
				retryCount: j.retryCount + 1,
				startedAt: void 0,
				finishedAt: void 0,
				imageId: void 0,
				seed: makeSeed()
			} : j)
		}));
		import("./queue-DcBFgZhp.mjs").then((m) => m.wakeQueue());
	},
	retryFailed: () => {
		set((s) => ({
			paused: false,
			jobs: s.jobs.map((j) => j.status === "error" ? {
				...j,
				status: "queued",
				error: void 0,
				retryCount: j.retryCount + 1,
				startedAt: void 0,
				finishedAt: void 0,
				imageId: void 0,
				seed: makeSeed()
			} : j)
		}));
		import("./queue-DcBFgZhp.mjs").then((m) => m.wakeQueue());
	},
	addGalleryFromJob: async (job, dataUrl) => {
		if (savingJobs.has(job.id)) return;
		const current = get().jobs.find((j) => j.id === job.id);
		if (current?.status === "done" && current.imageId) return;
		if (get().gallery.some((g) => g.jobId === job.id)) {
			set((s) => ({ jobs: s.jobs.map((j) => j.id === job.id && !j.imageId ? {
				...j,
				status: "done",
				imageId: s.gallery.find((g) => g.jobId === job.id)?.id,
				finishedAt: j.finishedAt ?? Date.now()
			} : j) }));
			return;
		}
		savingJobs.add(job.id);
		try {
			const imageId = uid("img");
			await saveImageBlob(imageId, dataUrlToBlob(dataUrl));
			const item = {
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
				layoutId: job.layoutId,
				layoutName: job.layoutName
			};
			set((s) => {
				if (s.gallery.some((g) => g.jobId === job.id)) return { jobs: s.jobs.map((j) => j.id === job.id ? {
					...j,
					status: "done",
					imageId: j.imageId ?? s.gallery.find((g) => g.jobId === job.id)?.id,
					finishedAt: j.finishedAt ?? Date.now()
				} : j) };
				const gallery = trimGallery([item, ...s.gallery]);
				const dropped = s.gallery.filter((g) => !gallery.some((x) => x.id === g.id));
				for (const d of dropped) deleteImageBlob(d.id);
				return {
					gallery,
					jobs: s.jobs.map((j) => j.id === job.id ? {
						...j,
						status: "done",
						imageId,
						finishedAt: Date.now()
					} : j),
					durations: job.startedAt ? [...s.durations, Date.now() - job.startedAt].slice(-20) : s.durations
				};
			});
		} finally {
			savingJobs.delete(job.id);
		}
	},
	toggleGalleryFavorite: (id) => set((s) => ({ gallery: s.gallery.map((g) => g.id === id ? {
		...g,
		favorite: !g.favorite
	} : g) })),
	deleteGalleryItem: async (id) => {
		await deleteImageBlob(id);
		set((s) => ({
			gallery: s.gallery.filter((g) => g.id !== id),
			lightboxId: s.lightboxId === id ? null : s.lightboxId
		}));
	},
	nextQueued: (limit) => get().jobs.filter((j) => j.status === "queued").slice(0, limit),
	runningCount: () => get().jobs.filter((j) => j.status === "running").length,
	avgDuration: () => {
		const d = get().durations;
		if (!d.length) return 28e3;
		return d.reduce((a, b) => a + b, 0) / d.length;
	}
}), {
	name: "handraw-studio-v1",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	merge: (persisted, current) => {
		const p = persisted ?? {};
		return {
			...current,
			...p,
			jobs: current.jobs,
			paused: false,
			activeJobId: current.activeJobId,
			lightboxId: current.lightboxId,
			studioTab: current.studioTab,
			layoutId: typeof p.layoutId === "string" ? p.layoutId : null,
			colorId: typeof p.colorId === "string" ? p.colorId : null,
			groupFilter: p.groupFilter === "FA" || p.groupFilter === "FB" || p.groupFilter === "FC" || p.groupFilter === "FD" || p.groupFilter === "FE" || p.groupFilter === "FF" || p.groupFilter === "FG" || p.groupFilter === "FH" ? p.groupFilter : "all",
			selected: Array.isArray(p.selected) ? p.selected.filter((n) => getStyle(n)) : [],
			styleFavorites: Array.isArray(p.styleFavorites) ? p.styleFavorites.filter((n) => getStyle(n)) : [],
			search: current.search,
			themeHistory: p.themeHistory ?? [],
			characterLock: p.characterLock ?? false,
			enhanceLevel: p.enhanceLevel === "short" || p.enhanceLevel === "cinematic" ? p.enhanceLevel : "full",
			copiesPerStyle: typeof p.copiesPerStyle === "number" ? Math.min(5, Math.max(1, Math.round(p.copiesPerStyle))) : 1,
			gallery: Array.isArray(p.gallery) ? p.gallery : current.gallery
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
		layoutId: s.layoutId,
		colorId: s.colorId
	})
}));
var inFlight = /* @__PURE__ */ new Set();
var batchSubjects = /* @__PURE__ */ new Map();
var timer;
var backoffUntil = 0;
var reducedUntil = 0;
function isRateLimited(message) {
	return /429|rate limit|too many|quota|capacity/i.test(message);
}
function siblings(batchId) {
	return useStudio.getState().jobs.filter((j) => j.batchId === batchId);
}
function anchorFailed(batchId) {
	const anchor = siblings(batchId).find((j) => !j.waitsForAnchor);
	return Boolean(anchor && (anchor.status === "error" || anchor.status === "cancelled"));
}
function batchDone(batchId) {
	return siblings(batchId).every((j) => j.status === "done" || j.status === "error" || j.status === "cancelled");
}
function canStart(job) {
	if (inFlight.has(job.id)) return false;
	if (!job.waitsForAnchor) return true;
	if (batchSubjects.has(job.batchId)) return true;
	if (anchorFailed(job.batchId)) return true;
	const anchor = siblings(job.batchId).find((j) => !j.waitsForAnchor);
	if (!anchor) return true;
	if (anchor.status === "queued" || anchor.status === "running") return false;
	return true;
}
function recoverOrphans() {
	const now = Date.now();
	for (const j of useStudio.getState().jobs) {
		if (j.status !== "running") continue;
		if (inFlight.has(j.id)) continue;
		if (now - (j.startedAt ?? 0) < 1500) continue;
		useStudio.getState().patchJob(j.id, {
			status: "queued",
			startedAt: void 0
		});
	}
}
function tick() {
	if (useStudio.getState().paused) return;
	recoverOrphans();
	const live = useStudio.getState();
	const anyRunning = live.jobs.some((j) => j.status === "running") || inFlight.size > 0;
	if (Date.now() < backoffUntil && anyRunning) return;
	if (Date.now() < backoffUntil && !anyRunning) backoffUntil = 0;
	const cap = Math.max(1, Math.min(4, Date.now() < reducedUntil ? 1 : live.concurrency || 2));
	const running = live.jobs.filter((j) => j.status === "running" || inFlight.has(j.id)).length;
	const slots = Math.max(0, cap - running);
	if (slots === 0) return;
	const queued = live.jobs.filter((j) => j.status === "queued" && canStart(j)).slice(0, slots);
	for (const job of queued) {
		if (inFlight.has(job.id)) continue;
		inFlight.add(job.id);
		useStudio.getState().patchJob(job.id, {
			status: "running",
			startedAt: Date.now()
		});
		const lockUrl = batchSubjects.get(job.batchId);
		runJob(job.id, lockUrl || userImageRef.current);
	}
}
async function runJob(id, userImageDataUrl) {
	const job = useStudio.getState().jobs.find((j) => j.id === id);
	if (!job || job.status === "cancelled" || job.status === "done" || job.status === "error") {
		inFlight.delete(id);
		return;
	}
	try {
		const image = userImageDataUrl || void 0;
		const result = await generateStyledImage({ data: {
			styleNumber: job.styleNumber,
			theme: job.theme,
			aspectRatio: job.aspectRatio,
			resolution: job.resolution,
			userImageDataUrl: job.hasUserImage || job.waitsForAnchor ? image : void 0,
			characterLock: job.characterLock,
			copyIndex: job.copyIndex,
			copies: job.copies,
			seed: job.seed,
			layoutId: job.layoutId,
			colorId: job.colorId
		} });
		const latest = useStudio.getState().jobs.find((j) => j.id === id);
		if (!latest || latest.status === "cancelled" || latest.status === "done") return;
		if (!result.ok) {
			if (isRateLimited(result.error)) {
				backoffUntil = Date.now() + 8e3 * Math.max(1, job.retryCount + 1);
				reducedUntil = Date.now() + 45e3;
			}
			useStudio.getState().patchJob(id, {
				status: "error",
				error: result.error,
				finishedAt: Date.now(),
				promptEn: result.promptEn ?? job.promptEn,
				promptZh: result.promptZh ?? job.promptZh
			});
			return;
		}
		if (job.characterLock && !job.waitsForAnchor) batchSubjects.set(job.batchId, result.dataUrl);
		await useStudio.getState().addGalleryFromJob({
			...latest,
			promptEn: result.promptEn,
			promptZh: result.promptZh,
			usedStyleRef: result.usedStyleRef
		}, result.dataUrl);
	} catch (err) {
		const latest = useStudio.getState().jobs.find((j) => j.id === id);
		if (!latest || latest.status === "cancelled" || latest.status === "done") return;
		useStudio.getState().patchJob(id, {
			status: "error",
			error: err instanceof Error ? err.message : "Generate failed",
			finishedAt: Date.now()
		});
	} finally {
		inFlight.delete(id);
		const jobNow = useStudio.getState().jobs.find((j) => j.id === id);
		if (jobNow && batchDone(jobNow.batchId)) batchSubjects.delete(jobNow.batchId);
	}
}
function ensureRunner() {
	if (typeof window === "undefined") return;
	if (timer) {
		tick();
		return;
	}
	const kick = () => tick();
	timer = window.setInterval(kick, 400);
	useStudio.subscribe(kick);
	kick();
}
function wakeQueue() {
	backoffUntil = 0;
	useStudio.getState().setPaused(false);
	ensureRunner();
}
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var hydrateOnce = null;
function ensureHydrated() {
	if (useStudio.persist.hasHydrated()) return Promise.resolve();
	if (!hydrateOnce) hydrateOnce = Promise.resolve(useStudio.persist.rehydrate()).then(() => void 0);
	return hydrateOnce;
}
function JobRunner() {
	(0, import_react.useEffect)(() => {
		ensureHydrated();
		ensureRunner();
	}, []);
	return null;
}
var COPY = {
	vi: {
		appName: "Handraw Studio",
		tagline: "312 phong cách vẽ tay · 161 bố cục · 30 màu · chọn · viết chủ đề · tạo ảnh",
		studio: "Studio",
		gallery: "Thư viện",
		jobs: "Hàng đợi",
		results: "Kết quả",
		styles: "Phong cách",
		layouts: "Bố cục",
		layoutOn: "đang dùng bố cục",
		layoutOff: "không gắn bố cục",
		layoutClear: "Bỏ bố cục",
		layoutNone: "Không bố cục",
		searchLayouts: "Tìm SC / IG / SB / IP / EC hoặc tên bố cục…",
		noLayouts: "Không khớp bố cục nào.",
		layoutHint: "Bố cục quyết định khung, chữ, đọc. Style quyết định nét vẽ.",
		color: "Màu chủ đạo",
		colorNone: "Không khóa màu",
		colorHint: "Một màu dẫn cả tranh. Không đụng style hay bố cục.",
		colorClear: "Bỏ màu",
		allGroups: "Tất cả",
		searchStyles: "Tìm số, tên, tác giả…",
		selected: "đã chọn",
		clear: "Bỏ chọn",
		favorites: "Yêu thích",
		themeLabel: "Chủ đề",
		themePlaceholder: "Ví dụ: ly trà sữa đầu thu, dạ yến Đại Đường…",
		attach: "Đính kèm ảnh",
		attachHint: "Ảnh chủ thể (tuỳ chọn). Studio sẽ giữ nội dung và vẽ lại theo style.",
		removeImage: "Gỡ ảnh",
		enhance: "Nâng cấp",
		enhancing: "Đang viết lại…",
		enhanceHint: "Viết lại chủ đề giàu chi tiết hình. Không đụng style.",
		enhanceNeed: "Nhập vài từ, hoặc dán ảnh, rồi nâng cấp.",
		enhanceDone: "Đã nâng cấp chủ đề.",
		enhanceFail: "Không nâng cấp được. Thử lại.",
		enhanceShort: "Ngắn",
		enhanceFull: "Đầy đủ",
		enhanceCinematic: "Điện ảnh",
		enhanceShortHint: "Một câu, sát ý gốc",
		enhanceFullHint: "Vài câu chi tiết hình",
		enhanceCinematicHint: "Ánh sáng, chất liệu, không khí",
		surprise: "Bất ngờ",
		surpriseHint: "Một chủ đề khớp nhóm style đang chọn",
		characterLock: "Giữ nhân vật",
		characterLockHint: "Ảnh đầu tiên làm mẫu cho các style còn lại trong lượt này.",
		useAsSubject: "Dùng làm chủ thể",
		usedAsSubject: "Đã lấy làm chủ thể. Chọn style khác rồi tạo.",
		undoEnhance: "Hoàn tác",
		history: "Chủ đề gần đây",
		historyEmpty: "Chưa có lịch sử.",
		pastedImage: "Đã dán ảnh từ clipboard.",
		dropHint: "Thả ảnh vào đây",
		pasteHint: "Dán ảnh Ctrl+V",
		generateKbd: "Ctrl+Enter tạo ảnh",
		aspectFromImage: (r) => `Đã chọn ${r} theo ảnh đính kèm.`,
		aspect: "Tỷ lệ",
		resolution: "Độ nét",
		concurrency: "Luồng song song",
		generate: "Tạo ảnh",
		generating: "Đang tạo",
		generateN: (n) => `Tạo ${n} ảnh`,
		copies: "Số ảnh / style",
		copiesHint: "Mỗi phong cách tạo N biến thể, tối đa 5.",
		needTheme: "Nhập chủ đề trước khi tạo.",
		needStyle: "Chọn ít nhất một phong cách.",
		inFlight: "Style này đang tạo. Đợi xong rồi tạo lượt mới.",
		maxBatch: (n) => `Tối đa ${n} style mỗi lượt. Bỏ bớt rồi tạo tiếp.`,
		queue: "Hàng đợi",
		queued: "Chờ",
		running: "Đang chạy",
		done: "Xong",
		error: "Lỗi",
		cancelled: "Huỷ",
		pause: "Tạm dừng",
		resume: "Tiếp tục",
		cancel: "Huỷ",
		cancelAll: "Huỷ còn lại",
		retry: "Thử lại",
		retryFailed: "Thử lại lỗi",
		emptyCanvas: "Bàn in đang trống",
		emptyCanvasHint: "Chọn style, tuỳ chọn bố cục, viết chủ đề, rồi bấm Tạo ảnh.",
		emptyGallery: "Chưa có ảnh nào.",
		emptyGalleryHint: "Tạo một lượt trong Studio. Kết quả sẽ lưu tại đây.",
		download: "Tải về",
		downloadFail: "Không tải được ảnh. Thử mở ảnh rồi lưu thủ công.",
		delete: "Xoá",
		copyPrompt: "Chép prompt",
		copied: "Đã chép",
		copyFail: "Trình duyệt chặn chép. Prompt đã hiện, bấm Ctrl+C.",
		open: "Xem lớn",
		eta: "ETA",
		workers: "luồng",
		aiUnavailable: "Tạo ảnh AI chưa sẵn sàng trong môi trường này.",
		lang: "EN",
		filterAll: "Tất cả",
		filterFav: "Đã thích",
		searchGallery: "Tìm theo chủ đề hoặc số style…",
		promptZh: "Prompt Trung",
		promptEn: "Prompt Anh",
		styleRef: "Tham chiếu style",
		userRef: "Ảnh đính kèm",
		batch: "Lượt",
		of: "/",
		costHint: (n) => `${n} ảnh · mỗi ảnh tốn quota Imagine của bạn`,
		selectAllVisible: "Chọn trang này",
		compare: "So sánh",
		close: "Đóng",
		useStyle: "Dùng style này",
		noResults: "Không khớp style nào.",
		jobSmart: "Hàng đợi tự điều phối luồng, tránh spam API, tự chậm khi bị giới hạn.",
		details: "Chi tiết",
		thisBatch: "Lượt này",
		collapseQueue: "Thu gọn hàng đợi",
		expandQueue: "Mở hàng đợi"
	},
	en: {
		appName: "Handraw Studio",
		tagline: "312 hand-drawn styles · 161 layouts · 30 colors · pick · prompt · generate",
		studio: "Studio",
		gallery: "Gallery",
		jobs: "Queue",
		results: "Results",
		styles: "Styles",
		layouts: "Layouts",
		layoutOn: "layout on",
		layoutOff: "no layout",
		layoutClear: "Clear layout",
		layoutNone: "No layout",
		searchLayouts: "Search SC / IG / SB / IP / EC or a layout name…",
		noLayouts: "No layouts match.",
		layoutHint: "Layout sets the frame and reading order. Style sets the drawing.",
		color: "Theme color",
		colorNone: "No color lock",
		colorHint: "One hue leads the picture. Style and layout stay as chosen.",
		colorClear: "Clear color",
		allGroups: "All",
		searchStyles: "Search number, name, author…",
		selected: "selected",
		clear: "Clear",
		favorites: "Favorites",
		themeLabel: "Theme",
		themePlaceholder: "e.g. autumn milk tea, a Tang night banquet…",
		attach: "Attach image",
		attachHint: "Optional subject photo. The studio keeps the content and redraws it in the chosen style.",
		removeImage: "Remove",
		enhance: "Enhance",
		enhancing: "Rewriting…",
		enhanceHint: "Rewrite the theme with richer visual detail. Style stays separate.",
		enhanceNeed: "Type a few words, or paste a photo, then enhance.",
		enhanceDone: "Theme enhanced.",
		enhanceFail: "Could not enhance. Try again.",
		enhanceShort: "Short",
		enhanceFull: "Full",
		enhanceCinematic: "Cinematic",
		enhanceShortHint: "One sentence, close to your words",
		enhanceFullHint: "A few sentences of visual detail",
		enhanceCinematicHint: "Light, material, atmosphere",
		surprise: "Surprise",
		surpriseHint: "A theme that fits the style group you picked",
		characterLock: "Keep character",
		characterLockHint: "The first image becomes the subject for the rest of this batch.",
		useAsSubject: "Use as subject",
		usedAsSubject: "Set as subject. Pick other styles, then generate.",
		undoEnhance: "Undo",
		history: "Recent themes",
		historyEmpty: "No history yet.",
		pastedImage: "Pasted image from clipboard.",
		dropHint: "Drop an image here",
		pasteHint: "Paste image Ctrl+V",
		generateKbd: "Ctrl+Enter to generate",
		aspectFromImage: (r) => `Set ${r} from the attached photo.`,
		aspect: "Ratio",
		resolution: "Detail",
		concurrency: "Parallel jobs",
		generate: "Generate",
		generating: "Generating",
		generateN: (n) => `Generate ${n}`,
		copies: "Copies / style",
		copiesHint: "Each selected style makes N variations, max 5.",
		needTheme: "Add a theme first.",
		needStyle: "Pick at least one style.",
		inFlight: "That style is already generating. Wait, then run again.",
		maxBatch: (n) => `Max ${n} styles per run. Deselect some, then generate again.`,
		queue: "Queue",
		queued: "Queued",
		running: "Running",
		done: "Done",
		error: "Error",
		cancelled: "Cancelled",
		pause: "Pause",
		resume: "Resume",
		cancel: "Cancel",
		cancelAll: "Cancel rest",
		retry: "Retry",
		retryFailed: "Retry failed",
		emptyCanvas: "The press is idle",
		emptyCanvasHint: "Pick styles, optionally a layout, write a theme, then generate.",
		emptyGallery: "No images yet.",
		emptyGalleryHint: "Generate a batch in Studio. Results are stored here.",
		download: "Download",
		downloadFail: "Could not download. Open the image and save it manually.",
		delete: "Delete",
		copyPrompt: "Copy prompt",
		copied: "Copied",
		copyFail: "Clipboard blocked. Prompt is selected — press Ctrl+C.",
		open: "Open",
		eta: "ETA",
		workers: "workers",
		aiUnavailable: "Image generation is not available in this environment.",
		lang: "VI",
		filterAll: "All",
		filterFav: "Liked",
		searchGallery: "Search theme or style number…",
		promptZh: "Chinese prompt",
		promptEn: "English prompt",
		styleRef: "Style reference",
		userRef: "Attached image",
		batch: "Batch",
		of: "/",
		costHint: (n) => `${n} images · each one spends your Imagine quota`,
		selectAllVisible: "Select visible",
		compare: "Compare",
		close: "Close",
		useStyle: "Use this style",
		noResults: "No matching styles.",
		jobSmart: "The queue throttles workers, skips duplicates, and backs off on rate limits.",
		details: "Details",
		thisBatch: "This batch",
		collapseQueue: "Collapse queue",
		expandQueue: "Expand queue"
	}
};
function t(lang) {
	return COPY[lang];
}
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const lang = useStudio((s) => s.lang);
	const setLang = useStudio((s) => s.setLang);
	const live = useStudio((s) => s.jobs.filter((j) => j.status === "queued" || j.status === "running").length);
	const copy = t(lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper-grain flex h-dvh flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobRunner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "z-40 shrink-0 border-b border-line bg-bg/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-14 items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-w-0 items-center gap-2 sm:gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-7 shrink-0 items-center justify-center rounded-full bg-stamp text-stamp-fg sm:size-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm leading-none font-semibold sm:text-base",
								children: "H"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg leading-none font-semibold tracking-tight sm:text-xl",
								children: "Handraw"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-[0.65rem] tracking-[0.22em] text-ink-subtle uppercase sm:inline",
								children: "Studio"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "ml-auto flex items-center gap-0.5 sm:gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex rounded-full bg-bg-elevated p-0.5 shadow-[var(--shadow-border)] sm:p-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									className: cn("inline-flex size-10 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors duration-150 sm:h-9 sm:w-auto sm:px-3", pathname === "/" ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-ink-muted hover:text-ink"),
									"aria-label": copy.studio,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: copy.studio
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/gallery",
									className: cn("inline-flex size-10 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors duration-150 sm:h-9 sm:w-auto sm:px-3", pathname.startsWith("/gallery") ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-ink-muted hover:text-ink"),
									"aria-label": copy.gallery,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Images, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: copy.gallery
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setLang(lang === "vi" ? "en" : "vi"),
								className: "inline-flex h-10 items-center gap-1 rounded-full px-2 text-xs font-medium tracking-wide text-ink-muted hover:bg-stamp-soft hover:text-ink sm:h-11 sm:gap-1.5 sm:px-3",
								"aria-label": "Language",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sm:inline",
									children: copy.lang
								})]
							}),
							live > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative ml-0.5 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-stamp px-2 text-xs font-medium text-stamp-fg tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "stamp-live absolute top-0 right-0 size-2 rounded-full bg-stamp" }), live]
							}) : null
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 w-full flex-1 flex-col overflow-hidden",
				children
			})
		]
	});
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
function TooltipContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset: 6,
		className: cn("z-50 rounded-sm bg-ink px-2 py-1 text-xs text-bg-elevated", className),
		...props
	}) });
}
var styles_default = "/assets/styles-xWt1jEVW.css";
var APP_NAME = "Handraw Studio";
var Route$2 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Studio tạo ảnh theo 312 phong cách vẽ tay, 161 bố cục và 30 màu chủ đạo. Chọn style, chọn layout, viết chủ đề, generate song song."
			},
			{
				name: "theme-color",
				content: "#efe8d8"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,500&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "vi",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-bg text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
					delayDuration: 250,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						position: "bottom-right",
						toastOptions: {
							className: "font-sans",
							style: {
								background: "var(--color-surface)",
								color: "var(--color-ink)",
								border: "1px solid var(--color-line)"
							}
						}
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$1 = () => import("./routes-htjF2Ylo.mjs");
var Route$1 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./gallery-C3qq0kpc.mjs");
var Route = createFileRoute("/gallery")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	GalleryRoute: Route.update({
		id: "/gallery",
		path: "/gallery",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { t as a, useStudio as c, peekImageObjectUrl as d, subscribeImageCache as f, createSsrRpc as h, TooltipTrigger as i, getImageBlob as l, checkAiAvailable as m, Tooltip as n, userImageRef as p, TooltipContent as r, wakeQueue as s, router_exports as t, getImageObjectUrl as u };
