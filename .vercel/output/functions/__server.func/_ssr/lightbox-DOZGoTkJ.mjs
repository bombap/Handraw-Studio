import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as uid, n as dataUrlToBlob, t as cn } from "./utils-OVG4zYKs.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as shouldUseStyleReference, i as getStyle, n as buildPrompts } from "./prompt-DPJN2OUm.mjs";
import { d as LayoutGrid, f as Languages, g as Download, h as Heart, p as Images, r as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { y as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lightbox-DOZGoTkJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var generateStyledImage = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("d23950bc48f6fb0181df135e34b5c0c093e51e1b3dd59cf4b814ced3b94ccf26"));
var checkAiAvailable = createServerFn({ method: "POST" }).handler(createSsrRpc("9954c43fd601ae948e4679f42e17f11705eab224b805183bbfa7d935436c25eb"));
var DB_NAME = "handraw-studio";
var DB_VERSION = 1;
var STORE = "images";
var urlCache = /* @__PURE__ */ new Map();
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
var ASPECT_OPTIONS = [
	{
		id: "1:1",
		label: "1:1",
		w: 1,
		h: 1
	},
	{
		id: "3:4",
		label: "3:4",
		w: 3,
		h: 4
	},
	{
		id: "4:3",
		label: "4:3",
		w: 4,
		h: 3
	},
	{
		id: "2:3",
		label: "2:3",
		w: 2,
		h: 3
	},
	{
		id: "3:2",
		label: "3:2",
		w: 3,
		h: 2
	},
	{
		id: "9:16",
		label: "9:16",
		w: 9,
		h: 16
	},
	{
		id: "16:9",
		label: "16:9",
		w: 16,
		h: 9
	}
];
function trimGallery(items) {
	if (items.length <= 120) return items;
	return items.slice().sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.createdAt - a.createdAt).slice(0, 120);
}
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
		const batchId = uid("batch");
		const now = Date.now();
		const useStyleRef = shouldUseStyleReference();
		const jobs = [];
		for (const number of pick) {
			const style = getStyle(number);
			if (!style) continue;
			if (s.jobs.some((j) => (j.status === "queued" || j.status === "running") && j.styleNumber === number && j.theme === theme && j.aspectRatio === s.aspectRatio)) continue;
			const prompts = buildPrompts({
				style,
				theme,
				aspectRatio: s.aspectRatio,
				hasUserImage: Boolean(userImageDataUrl),
				useStyleRef
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
				hasUserImage: Boolean(userImageDataUrl),
				usedStyleRef: useStyleRef,
				status: "queued",
				createdAt: now,
				retryCount: 0
			});
		}
		if (jobs.length === 0) return {
			ok: false,
			error: "needStyle"
		};
		set((prev) => ({
			jobs: [...jobs, ...prev.jobs],
			paused: false
		}));
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
	retryJob: (id) => set((s) => ({
		paused: false,
		jobs: s.jobs.map((j) => j.id === id && (j.status === "error" || j.status === "cancelled") ? {
			...j,
			status: "queued",
			error: void 0,
			retryCount: j.retryCount + 1,
			startedAt: void 0,
			finishedAt: void 0
		} : j)
	})),
	retryFailed: () => set((s) => ({
		paused: false,
		jobs: s.jobs.map((j) => j.status === "error" ? {
			...j,
			status: "queued",
			error: void 0,
			retryCount: j.retryCount + 1,
			startedAt: void 0,
			finishedAt: void 0
		} : j)
	})),
	addGalleryFromJob: async (job, dataUrl) => {
		const imageId = job.id;
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
			promptEn: job.promptEn
		};
		set((s) => {
			const gallery = trimGallery([item, ...s.gallery.filter((g) => g.id !== imageId)]);
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
	partialize: (s) => ({
		lang: s.lang,
		theme: s.theme,
		selected: s.selected,
		aspectRatio: s.aspectRatio,
		resolution: s.resolution,
		concurrency: s.concurrency,
		styleFavorites: s.styleFavorites,
		jobs: s.jobs.map((j) => j.status === "running" ? {
			...j,
			status: "queued",
			startedAt: void 0
		} : j),
		gallery: s.gallery,
		durations: s.durations
	})
}));
var inFlight = /* @__PURE__ */ new Set();
var timer;
var backoffUntil = 0;
var reducedUntil = 0;
var booted = false;
function isRateLimited(message) {
	return /429|rate limit|too many|quota|capacity/i.test(message);
}
async function tick(userImageRef) {
	const state = useStudio.getState();
	if (state.paused) return;
	if (Date.now() < backoffUntil) return;
	const cap = Date.now() < reducedUntil ? 1 : state.concurrency;
	const running = state.jobs.filter((j) => j.status === "running").length + inFlight.size;
	const slots = Math.max(0, cap - running);
	if (slots === 0) return;
	const queued = state.jobs.filter((j) => j.status === "queued" && !inFlight.has(j.id)).slice(0, slots);
	for (const job of queued) {
		inFlight.add(job.id);
		useStudio.getState().patchJob(job.id, {
			status: "running",
			startedAt: Date.now()
		});
		runJob(job.id, userImageRef.current);
	}
}
async function runJob(id, userImageDataUrl) {
	const job = useStudio.getState().jobs.find((j) => j.id === id);
	if (!job) {
		inFlight.delete(id);
		return;
	}
	if (job.status === "cancelled") {
		inFlight.delete(id);
		return;
	}
	try {
		const result = await generateStyledImage({ data: {
			styleNumber: job.styleNumber,
			theme: job.theme,
			aspectRatio: job.aspectRatio,
			resolution: job.resolution,
			userImageDataUrl: job.hasUserImage ? userImageDataUrl || void 0 : void 0
		} });
		const latest = useStudio.getState().jobs.find((j) => j.id === id);
		if (!latest || latest.status === "cancelled") return;
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
		await useStudio.getState().addGalleryFromJob({
			...latest,
			promptEn: result.promptEn,
			promptZh: result.promptZh,
			usedStyleRef: result.usedStyleRef
		}, result.dataUrl);
	} catch (err) {
		const latest = useStudio.getState().jobs.find((j) => j.id === id);
		if (!latest || latest.status === "cancelled") return;
		useStudio.getState().patchJob(id, {
			status: "error",
			error: err instanceof Error ? err.message : "Generate failed",
			finishedAt: Date.now()
		});
	} finally {
		inFlight.delete(id);
	}
}
function startJobRunner(userImageRef) {
	if (timer) return () => void 0;
	if (!booted) {
		booted = true;
		if (useStudio.getState().jobs.some((j) => j.status === "queued")) useStudio.getState().setPaused(true);
	}
	const kick = () => void tick(userImageRef);
	timer = window.setInterval(kick, 450);
	const unsub = useStudio.subscribe(kick);
	kick();
	return () => {
		window.clearInterval(timer);
		timer = void 0;
		unsub();
	};
}
var userImageRef = { current: null };
function JobRunner() {
	(0, import_react.useEffect)(() => {
		let stop;
		Promise.resolve(useStudio.persist.rehydrate()).then(() => {
			stop = startJobRunner(userImageRef);
		});
		return () => stop?.();
	}, []);
	return null;
}
var COPY = {
	vi: {
		appName: "Handraw Studio",
		tagline: "261 phong cách vẽ tay · chọn style · viết chủ đề · tạo ảnh",
		studio: "Studio",
		gallery: "Thư viện",
		jobs: "Hàng đợi",
		results: "Kết quả",
		styles: "Phong cách",
		allGroups: "Tất cả",
		searchStyles: "Tìm số, tên, tác giả…",
		selected: "đã chọn",
		clear: "Bỏ chọn",
		favorites: "Yêu thích",
		themeLabel: "Chủ đề",
		themePlaceholder: "Ví dụ: ly trà sữa đầu thu, một cậu bé đốt pháo trên tuyết, dạ yến Đại Đường…",
		attach: "Đính kèm ảnh",
		attachHint: "Ảnh chủ thể (tuỳ chọn). Studio sẽ giữ nội dung và vẽ lại theo style.",
		removeImage: "Gỡ ảnh",
		aspect: "Tỷ lệ",
		resolution: "Độ nét",
		concurrency: "Luồng song song",
		generate: "Tạo ảnh",
		generating: "Đang tạo",
		generateN: (n) => `Tạo ${n} ảnh`,
		needTheme: "Nhập chủ đề trước khi tạo.",
		needStyle: "Chọn ít nhất một phong cách.",
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
		emptyCanvasHint: "Chọn style bên trái, viết chủ đề phía trên, rồi bấm Tạo ảnh.",
		emptyGallery: "Chưa có ảnh nào.",
		emptyGalleryHint: "Tạo một lượt trong Studio. Kết quả sẽ lưu tại đây.",
		download: "Tải về",
		delete: "Xoá",
		copyPrompt: "Chép prompt",
		copied: "Đã chép",
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
		tagline: "261 hand-drawn styles · pick · prompt · generate",
		studio: "Studio",
		gallery: "Gallery",
		jobs: "Queue",
		results: "Results",
		styles: "Styles",
		allGroups: "All",
		searchStyles: "Search number, name, author…",
		selected: "selected",
		clear: "Clear",
		favorites: "Favorites",
		themeLabel: "Theme",
		themePlaceholder: "e.g. first autumn milk tea, a boy lighting firecrackers in snow, a Tang night banquet…",
		attach: "Attach image",
		attachHint: "Optional subject photo. The studio keeps the content and redraws it in the chosen style.",
		removeImage: "Remove",
		aspect: "Ratio",
		resolution: "Detail",
		concurrency: "Parallel jobs",
		generate: "Generate",
		generating: "Generating",
		generateN: (n) => `Generate ${n}`,
		needTheme: "Add a theme first.",
		needStyle: "Pick at least one style.",
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
		emptyCanvasHint: "Pick styles on the left, write a theme above, then generate.",
		emptyGallery: "No images yet.",
		emptyGalleryHint: "Generate a batch in Studio. Results are stored here.",
		download: "Download",
		delete: "Delete",
		copyPrompt: "Copy prompt",
		copied: "Copied",
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
				className: "z-40 shrink-0 border-b border-line bg-bg/85 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-16 items-center gap-3 px-3 sm:px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-w-0 items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-8 shrink-0 items-center justify-center rounded-full bg-stamp text-stamp-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base leading-none font-semibold",
								children: "H"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl leading-none font-semibold tracking-tight",
								children: "Handraw"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-[0.65rem] tracking-[0.22em] text-ink-subtle uppercase sm:inline",
								children: "Studio"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "ml-auto flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex rounded-full bg-bg-elevated p-1 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									className: cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors duration-150", pathname === "/" ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-ink-muted hover:text-ink"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: copy.studio
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/gallery",
									className: cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors duration-150", pathname.startsWith("/gallery") ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-ink-muted hover:text-ink"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Images, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: copy.gallery
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setLang(lang === "vi" ? "en" : "vi"),
								className: "inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-xs font-medium tracking-wide text-ink-muted hover:bg-stamp-soft hover:text-ink",
								"aria-label": "Language",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "size-4" }), copy.lang]
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
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink", "placeholder:text-ink-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stamp", "disabled:opacity-40", className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[transform,background-color,opacity,box-shadow,color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp", {
	variants: {
		variant: {
			default: "bg-stamp text-stamp-fg hover:opacity-90",
			secondary: "bg-surface text-ink shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-ink-muted hover:bg-stamp-soft hover:text-ink",
			outline: "border border-line bg-surface text-ink hover:border-line-strong",
			danger: "bg-danger text-stamp-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11",
			chip: "h-8 px-2.5 text-xs rounded-full"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function StoredImage({ id, alt, className }) {
	const [url, setUrl] = (0, import_react.useState)(() => peekImageObjectUrl(id));
	(0, import_react.useEffect)(() => {
		let alive = true;
		const cached = peekImageObjectUrl(id);
		if (cached) {
			setUrl(cached);
			return;
		}
		getImageObjectUrl(id).then((next) => {
			if (alive) setUrl(next);
		});
		return () => {
			alive = false;
		};
	}, [id]);
	if (!url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse bg-line", className),
		"aria-hidden": true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt,
		className: cn("img-outline object-cover", className)
	});
}
function Lightbox() {
	const copy = t(useStudio((s) => s.lang));
	const id = useStudio((s) => s.lightboxId);
	const setLightbox = useStudio((s) => s.setLightbox);
	const gallery = useStudio((s) => s.gallery);
	const jobs = useStudio((s) => s.jobs);
	const toggleFav = useStudio((s) => s.toggleGalleryFavorite);
	const deleteItem = useStudio((s) => s.deleteGalleryItem);
	const item = id ? gallery.find((g) => g.id === id) : void 0;
	const job = id ? jobs.find((j) => j.id === id || j.imageId === id) : void 0;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-3 sm:p-6",
		onClick: () => setLightbox(null),
		role: "dialog",
		"aria-modal": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex max-h-[92vh] w-[min(96vw,920px)] flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border-hover)]",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-md bg-surface/90 text-ink-muted hover:text-ink",
					onClick: () => setLightbox(null),
					"aria-label": copy.close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoredImage, {
					id: current.id,
					alt: `#${current.styleNumber} ${current.theme}`,
					className: "max-h-[70vh] w-full object-contain"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-lg font-medium tracking-tight",
							children: [
								"#",
								current.styleNumber,
								" · ",
								current.styleName
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink-muted",
							children: current.theme
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => void copyPrompt(),
								children: copy.copyPrompt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => void download(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), copy.download]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => toggleFav(current.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: current.favorite ? "size-3.5 fill-stamp text-stamp" : "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => void deleteItem(current.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { Lightbox as a, t as c, Input as i, useStudio as l, AppShell as n, StoredImage as o, Button as r, checkAiAvailable as s, ASPECT_OPTIONS as t, userImageRef as u };
