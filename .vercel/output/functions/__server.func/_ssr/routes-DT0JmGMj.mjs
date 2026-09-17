import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as resizeImageDataUrl, r as formatDuration, t as cn } from "./utils-OVG4zYKs.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as getStyle, r as filterStyles, t as GROUPS } from "./prompt-DPJN2OUm.mjs";
import { _ as ChevronDown, a as Sparkles, c as Play, h as Heart, i as Square, l as Pause, m as ImagePlus, o as Search, s as RotateCcw, t as X, u as LoaderCircle, v as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogPortal$1, i as DialogOverlay$1, n as DialogClose, o as DialogTitle$1, r as DialogContent$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Lightbox, c as t, i as Input, l as useStudio, n as AppShell, o as StoredImage, r as Button, s as checkAiAvailable, t as ASPECT_OPTIONS, u as userImageRef } from "./lightbox-DOZGoTkJ.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { i as TooltipTrigger, n as Tooltip, r as TooltipContent } from "./router-CBnq3RWd.mjs";
import { n as nn, r as qt, t as Qt } from "../_libs/react-resizable-panels.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DT0JmGMj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Popover = Root2;
var PopoverTrigger = Trigger;
function PopoverContent({ className, align = "end", sideOffset = 8, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		align,
		sideOffset,
		className: cn("z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-xl bg-surface p-3 shadow-[var(--shadow-border-hover)] outline-none", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	}) });
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-16 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink", "placeholder:text-ink-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stamp", "disabled:opacity-40 resize-none", className),
		...props
	});
}
function ComposePanel() {
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
	const [preview, setPreview] = (0, import_react.useState)(userImageRef.current);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const running = jobs.filter((j) => j.status === "queued" || j.status === "running").length;
	const currentAspect = ASPECT_OPTIONS.find((o) => o.id === aspectRatio) ?? ASPECT_OPTIONS[0];
	async function onFile(file) {
		if (!file.type.startsWith("image/")) {
			toast.error(lang === "vi" ? "Chỉ nhận file ảnh" : "Images only");
			return;
		}
		const reader = new FileReader();
		reader.onload = async () => {
			try {
				const resized = await resizeImageDataUrl(String(reader.result));
				userImageRef.current = resized;
				setPreview(resized);
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
		if (selected.length > 12) {
			toast.error(copy.maxBatch(12));
			return;
		}
		setBusy(true);
		try {
			if (!(await checkAiAvailable()).available) {
				toast.error(copy.aiUnavailable);
				return;
			}
			const result = enqueueBatch(userImageRef.current ?? void 0);
			if (!result.ok) {
				const key = result.error;
				toast.error(key === "needTheme" || key === "needStyle" ? copy[key] : result.error);
				return;
			}
			toast.success(lang === "vi" ? `Đã xếp ${result.count} việc vào hàng đợi` : `Queued ${result.count} jobs`);
		} finally {
			setBusy(false);
		}
	}
	const n = Math.min(selected.length, 12);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "shrink-0 border-b border-line bg-bg-elevated/70 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2 px-3 py-2.5 sm:px-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 sm:flex-nowrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "theme-input",
						value: theme,
						onChange: (e) => setTheme(e.target.value),
						onInput: (e) => {
							const el = e.currentTarget;
							el.style.height = "auto";
							el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
						},
						placeholder: copy.themePlaceholder,
						rows: 1,
						className: "min-h-11 max-h-24 w-full min-w-0 flex-1 py-2.5 sm:w-auto",
						"aria-label": copy.themeLabel
					}),
					preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative size-11 shrink-0 overflow-hidden rounded-md shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: preview,
							alt: "",
							className: "img-outline size-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								userImageRef.current = null;
								setPreview(null);
							},
							className: "absolute inset-0 flex items-center justify-center bg-ink/50 text-bg opacity-0 transition-opacity duration-150 hover:opacity-100",
							"aria-label": copy.removeImage,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							onDragOver: (e) => e.preventDefault(),
							onDrop: (e) => {
								e.preventDefault();
								const file = e.dataTransfer.files[0];
								if (file) onFile(file);
							},
							className: "flex size-11 shrink-0 items-center justify-center rounded-md border border-dashed border-line-strong bg-surface text-ink-muted hover:border-stamp hover:text-ink",
							"aria-label": copy.attach,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: copy.attachHint })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: (e) => {
							const file = e.target.files?.[0];
							if (file) onFile(file);
							e.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-surface px-2.5 text-xs font-medium text-ink shadow-[var(--shadow-border)]",
							"aria-label": copy.aspect,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatioGlyph, {
									w: currentAspect.w,
									h: currentAspect.h
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden tabular-nums sm:inline",
									children: currentAspect.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5 text-ink-subtle" })
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
						className: "w-64",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-medium text-ink-muted",
								children: copy.aspect
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-1.5",
								children: ASPECT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setAspectRatio(opt.id),
									className: cn("flex h-14 flex-col items-center justify-center gap-1 rounded-md text-xs", aspectRatio === opt.id ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted hover:text-ink"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatioGlyph, {
										w: opt.w,
										h: opt.h
									}), opt.label]
								}, opt.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 mb-2 text-xs font-medium text-ink-muted sm:hidden",
								children: copy.resolution
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1 sm:hidden",
								children: ["1k", "2k"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setResolution(r),
									className: cn("h-9 flex-1 rounded-md text-xs font-medium uppercase", resolution === r ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted"),
									children: r
								}, r))
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden shrink-0 rounded-md bg-surface p-1 shadow-[var(--shadow-border)] sm:flex",
						children: ["1k", "2k"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setResolution(r),
							className: cn("h-9 min-w-10 rounded-sm px-2 text-xs font-medium uppercase", resolution === r ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"),
							children: r
						}, r))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "h-11 min-w-11 flex-1 px-4 sm:flex-none",
						disabled: busy || n === 0,
						onClick: () => void generate(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: busy || running > 0 ? copy.generating : n > 0 ? copy.generateN(n) : copy.generate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: n > 0 ? n : copy.generate
							})
						]
					})
				]
			})
		}), selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "chip-scroll flex gap-1.5 overflow-x-auto border-t border-line px-3 py-2 sm:px-5",
			children: selected.map((num) => {
				const style = getStyle(num);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => toggleStyle(num),
					className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-surface pr-2 pl-0.5 shadow-[var(--shadow-border)]",
					children: [
						style ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: style.previewUrl,
							alt: "",
							className: "size-7 rounded-full object-cover"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs text-stamp tabular-nums",
							children: ["#", num]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3 text-ink-subtle" })
					]
				}, num);
			})
		}) : null]
	});
}
function RatioGlyph({ w, h }) {
	const max = Math.max(w, h);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-block rounded-[1px] border border-current opacity-80",
		style: {
			width: `${6 + w / max * 10}px`,
			height: `${6 + h / max * 10}px`
		}
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-stamp-soft text-stamp",
		muted: "bg-line text-ink-muted",
		outline: "border border-line text-ink-muted",
		ok: "bg-ok/12 text-ok",
		warn: "bg-warn/12 text-warn",
		danger: "bg-danger/12 text-danger"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Progress({ value, className }) {
	const pct = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-line", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-stamp transition-[width] duration-300 ease-out",
			style: { width: `${pct}%` }
		})
	});
}
var STATUS_VARIANT = {
	queued: "muted",
	running: "warn",
	done: "ok",
	error: "danger",
	cancelled: "outline"
};
function JobDock() {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const jobs = useStudio((s) => s.jobs);
	const paused = useStudio((s) => s.paused);
	const setPaused = useStudio((s) => s.setPaused);
	const cancelJob = useStudio((s) => s.cancelJob);
	const cancelQueued = useStudio((s) => s.cancelQueued);
	const retryJob = useStudio((s) => s.retryJob);
	const retryFailed = useStudio((s) => s.retryFailed);
	const setActiveJob = useStudio((s) => s.setActiveJob);
	const setLightbox = useStudio((s) => s.setLightbox);
	const durations = useStudio((s) => s.durations);
	const concurrency = useStudio((s) => s.concurrency);
	const setConcurrency = useStudio((s) => s.setConcurrency);
	const avg = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 28e3;
	const [open, setOpen] = (0, import_react.useState)(true);
	const live = jobs.filter((j) => j.status === "queued" || j.status === "running");
	const done = jobs.filter((j) => j.status === "done").length;
	const failed = jobs.filter((j) => j.status === "error");
	const recent = jobs.slice(0, 24);
	const total = jobs.length;
	const progress = total ? done / total * 100 : 0;
	const etaMs = jobs.filter((j) => j.status === "queued").length * (avg / Math.max(1, concurrency));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "shrink-0 border-t border-line bg-bg-elevated/80 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 px-3 py-2 sm:px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setOpen((v) => !v),
					className: "flex min-w-0 flex-1 items-center gap-2 text-left",
					"aria-expanded": open,
					"aria-label": open ? copy.collapseQueue : copy.expandQueue,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 shrink-0 text-ink-subtle transition-transform duration-150", !open && "-rotate-90") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base font-medium tracking-tight",
							children: copy.queue
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-ink-subtle tabular-nums",
							children: [
								live.length,
								" ",
								copy.running.toLowerCase(),
								" · ",
								copy.eta,
								" ",
								formatDuration(etaMs),
								" ·",
								" ",
								concurrency,
								" ",
								copy.workers
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-0.5 rounded-md bg-surface p-0.5 shadow-[var(--shadow-border)] sm:flex",
					children: [
						1,
						2,
						3,
						4
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setConcurrency(n),
						className: cn("size-8 rounded-sm text-xs tabular-nums", concurrency === n ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"),
						"aria-label": `${copy.concurrency} ${n}`,
						children: n
					}, n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => setPaused(!paused),
							children: [paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: paused ? copy.resume : copy.pause
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: cancelQueued,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden md:inline",
								children: copy.cancelAll
							})]
						}),
						failed.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: retryFailed,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden md:inline",
								children: copy.retryFailed
							})]
						}) : null
					]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pb-2 sm:px-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "film-scroll flex gap-2 overflow-x-auto px-3 pb-3 sm:px-5",
			children: recent.map((job) => {
				const style = getStyle(job.styleNumber);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "w-28 shrink-0 overflow-hidden rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "relative block aspect-square w-full overflow-hidden rounded-md bg-bg-elevated",
						onClick: () => {
							setActiveJob(job.id);
							if (job.imageId) setLightbox(job.imageId);
						},
						children: [job.imageId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoredImage, {
							id: job.imageId,
							alt: `#${job.styleNumber}`,
							className: "size-full"
						}) : style ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: style.previewUrl,
							alt: "",
							className: "size-full object-cover opacity-70"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-line" }), job.status === "running" || job.status === "queued" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-0 flex items-center justify-center bg-ink/25",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-surface" })
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-1 px-1 pt-1.5 pb-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate font-mono text-xs tabular-nums",
									children: ["#", job.styleNumber]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: STATUS_VARIANT[job.status],
									className: "mt-0.5",
									children: copy[job.status]
								})]
							}),
							job.status === "queued" || job.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-7 items-center justify-center rounded-sm text-ink-subtle hover:bg-line hover:text-ink",
								onClick: () => cancelJob(job.id),
								"aria-label": copy.cancel,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3" })
							}) : null,
							job.status === "error" || job.status === "cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-7 items-center justify-center rounded-sm text-ink-subtle hover:bg-line hover:text-ink",
								onClick: () => retryJob(job.id),
								"aria-label": copy.retry,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" })
							}) : null
						]
					})]
				}, job.id);
			})
		})] }) : null]
	});
}
function LiveCanvas() {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const jobs = useStudio((s) => s.jobs);
	const setLightbox = useStudio((s) => s.setLightbox);
	const latestBatch = jobs[0]?.batchId;
	const batchJobs = (0, import_react.useMemo)(() => latestBatch ? jobs.filter((j) => j.batchId === latestBatch) : jobs.slice(0, 8), [jobs, latestBatch]);
	const show = batchJobs.length > 0 ? batchJobs : jobs.filter((j) => j.status === "done").slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden paper-grid",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-baseline justify-between gap-2 px-4 py-3 sm:px-5 sm:py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl leading-tight font-medium tracking-tight",
					children: copy.thisBatch
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-ink-subtle tabular-nums",
					children: show.length
				})]
			}),
			show.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center justify-center gap-3 px-8 pb-20 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl",
					children: copy.emptyCanvas
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-sm leading-relaxed text-ink-muted",
					children: copy.emptyCanvasHint
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 p-4 sm:p-5 xl:grid-cols-3",
					children: show.map((job) => {
						const style = getStyle(job.styleNumber);
						const ratio = job.aspectRatio.split(":").map(Number);
						const pad = ratio[1] && ratio[0] ? ratio[1] / ratio[0] * 100 : 100;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rise-in overflow-hidden rounded-xl bg-surface p-1 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "relative block w-full overflow-hidden rounded-lg",
								style: { paddingBottom: `${pad}%` },
								onClick: () => job.imageId && setLightbox(job.imageId),
								disabled: !job.imageId,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0",
									children: job.imageId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoredImage, {
										id: job.imageId,
										alt: `#${job.styleNumber} ${job.theme}`,
										className: "size-full"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("flex size-full items-center justify-center bg-bg-elevated", job.status === "error" && "bg-stamp-soft"),
										children: job.status === "running" || job.status === "queued" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-ink-subtle" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-3 text-center text-xs text-ink-muted",
											children: job.error ?? copy[job.status]
										})
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 px-2.5 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate font-mono text-xs tabular-nums",
										children: ["#", job.styleNumber]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-ink-muted",
										children: job.styleName
									})]
								}), style ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: style.previewUrl,
									alt: "",
									className: "img-outline size-8 shrink-0 rounded-md object-cover"
								}) : null]
							})]
						}, job.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbox, {})
		]
	});
}
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			orientation: "vertical",
			className: "flex w-2 touch-none select-none p-0.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-line-strong" })
		})]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-ink/50", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(96vw,960px)] -translate-x-1/2 -translate-y-1/2", "rounded-xl bg-surface p-5 shadow-[var(--shadow-border-hover)]", "max-h-[92vh] overflow-auto", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 flex size-10 items-center justify-center rounded-md text-ink-muted hover:bg-line hover:text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function StyleDetail({ style, open, onOpenChange, onUse }) {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	if (!style) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
				"#",
				style.number,
				" · ",
				style.generationName
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-5 sm:grid-cols-[240px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: style.previewUrl,
					alt: style.generationName,
					className: "img-outline aspect-square w-full rounded-lg object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: style.groupId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "muted",
								children: lang === "vi" ? style.groupLabelVi : style.groupLabelEn
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-ink-muted",
							children: [
								lang === "vi" ? "Tác giả / tên style" : "Author / style name",
								": ",
								style.reference
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed",
							children: style.traits
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-auto w-fit",
							onClick: () => onUse(style.number),
							children: copy.useStyle
						})
					]
				})]
			})]
		})
	});
}
function StyleGrid() {
	const lang = useStudio((s) => s.lang);
	const search = useStudio((s) => s.search);
	const setSearch = useStudio((s) => s.setSearch);
	const groupFilter = useStudio((s) => s.groupFilter);
	const setGroupFilter = useStudio((s) => s.setGroupFilter);
	const onlyFavorites = useStudio((s) => s.onlyFavorites);
	const setOnlyFavorites = useStudio((s) => s.setOnlyFavorites);
	const selected = useStudio((s) => s.selected);
	const toggleStyle = useStudio((s) => s.toggleStyle);
	const setSelected = useStudio((s) => s.setSelected);
	const clearSelected = useStudio((s) => s.clearSelected);
	const favorites = useStudio((s) => s.styleFavorites);
	const toggleFav = useStudio((s) => s.toggleStyleFavorite);
	const copy = t(lang);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const styles = (0, import_react.useMemo)(() => filterStyles({
		query: search,
		group: groupFilter,
		favorites,
		onlyFavorites
	}), [
		search,
		groupFilter,
		favorites,
		onlyFavorites
	]);
	const visibleNumbers = styles.map((s) => s.number);
	const allVisibleSelected = visibleNumbers.length > 0 && visibleNumbers.every((n) => selected.includes(n));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 flex-1 flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 border-b border-line px-4 py-3 sm:px-5 sm:py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl leading-tight font-medium tracking-tight",
							children: copy.styles
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-ink-subtle tabular-nums",
							children: [
								styles.length,
								copy.of,
								"261 · ",
								selected.length,
								" ",
								copy.selected
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-9 rounded-full px-3 text-xs text-ink-muted hover:bg-stamp-soft hover:text-ink",
								onClick: () => {
									if (allVisibleSelected) setSelected(selected.filter((n) => !visibleNumbers.includes(n)));
									else setSelected([.../* @__PURE__ */ new Set([...selected, ...visibleNumbers])]);
								},
								children: copy.selectAllVisible
							}), selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-9 rounded-full px-3 text-xs text-ink-muted hover:bg-stamp-soft hover:text-ink",
								onClick: clearSelected,
								children: copy.clear
							}) : null]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: copy.searchStyles,
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chip-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupChip, {
								active: groupFilter === "all" && !onlyFavorites,
								onClick: () => {
									setGroupFilter("all");
									setOnlyFavorites(false);
								},
								children: copy.allGroups
							}),
							GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupChip, {
								active: groupFilter === g.id,
								title: lang === "vi" ? g.labelVi : g.labelEn,
								onClick: () => {
									setGroupFilter(g.id);
									setOnlyFavorites(false);
								},
								children: g.id
							}, g.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupChip, {
								active: onlyFavorites,
								onClick: () => {
									setOnlyFavorites(!onlyFavorites);
									setGroupFilter("all");
								},
								children: copy.favorites
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "min-h-0 flex-1",
				children: styles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-8 text-sm text-ink-muted",
					children: copy.noResults
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 xl:grid-cols-3 2xl:grid-cols-4",
					children: styles.map((style) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleCard, {
						style,
						selected: selected.includes(style.number),
						favored: favorites.includes(style.number),
						onToggle: () => toggleStyle(style.number),
						onFav: () => toggleFav(style.number),
						onDetail: () => setDetail(style.number)
					}, style.number))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleDetail, {
				style: detail ? getStyle(detail) : void 0,
				open: Boolean(detail),
				onOpenChange: (o) => !o && setDetail(null),
				onUse: (n) => {
					if (!selected.includes(n)) toggleStyle(n);
					setDetail(null);
				}
			})
		]
	});
}
function GroupChip({ active, onClick, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title,
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3 text-xs font-medium whitespace-nowrap", active ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted hover:text-ink"),
		children
	});
}
function StyleCard({ style, selected, favored, onToggle, onFav, onDetail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group relative rounded-xl bg-surface p-1 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out", "hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]", selected && "ring-2 ring-stamp ring-offset-2 ring-offset-bg"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onToggle,
				className: "block w-full text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-square overflow-hidden rounded-lg bg-bg-elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: style.previewUrl,
							alt: `#${style.number} ${style.generationName}`,
							loading: "lazy",
							decoding: "async",
							className: "img-outline size-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("absolute top-1.5 left-1.5 rounded-sm px-1.5 py-0.5 font-mono text-xs tabular-nums", selected ? "bg-stamp text-stamp-fg" : "bg-ink/80 text-bg-elevated"),
							children: style.number
						}),
						selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-1.5 bottom-1.5 flex size-6 items-center justify-center rounded-full bg-stamp text-stamp-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-2 pt-2 pb-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-2 min-h-8 text-xs leading-snug font-medium",
						children: style.generationName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xs text-ink-subtle",
						children: style.reference
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-2.5 right-2.5 flex gap-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						onFav();
					},
					className: cn("flex size-8 items-center justify-center rounded-md bg-surface/90 text-ink-muted shadow-[var(--shadow-border)] hover:text-stamp", favored ? "opacity-100" : "opacity-0 group-hover:opacity-100"),
					"aria-label": "Favorite",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-3.5", favored && "fill-stamp text-stamp") })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onDetail,
				className: cn("absolute right-2.5 bottom-10 h-7 items-center rounded-full bg-ink px-2.5 text-xs text-bg", selected ? "hidden" : "hidden group-hover:inline-flex"),
				children: style.groupId
			})
		]
	});
}
function useDesktopLayout() {
	const [desktop, setDesktop] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const apply = () => setDesktop(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);
	return desktop;
}
function StudioWorkspace() {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const [tab, setTab] = (0, import_react.useState)("styles");
	const selected = useStudio((s) => s.selected.length);
	const live = useStudio((s) => s.jobs.filter((j) => j.status === "queued" || j.status === "running").length);
	const hasJobs = useStudio((s) => s.jobs.length > 0);
	const desktop = useDesktopLayout();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComposePanel, {}),
			!desktop ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0 px-3 pt-2 pb-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex w-full rounded-full bg-bg-elevated p-1 shadow-[var(--shadow-border)]",
					children: [[
						"styles",
						copy.styles,
						selected
					], [
						"results",
						copy.results,
						live
					]].map(([id, label, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab(id),
						className: cn("relative h-10 flex-1 rounded-full text-sm font-medium transition-colors duration-150", tab === id ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-ink-muted"),
						children: [label, count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 font-mono text-xs text-stamp tabular-nums",
							children: count
						}) : null]
					}, id))
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 overflow-hidden",
				children: desktop ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(qt, {
					orientation: "horizontal",
					className: "h-full w-full",
					id: "handraw-studio",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Qt, {
							id: "styles",
							defaultSize: "42%",
							minSize: "28%",
							className: "flex min-h-0 flex-col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleGrid, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(nn, {
							className: "relative w-3 bg-transparent outline-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Qt, {
							id: "results",
							defaultSize: "58%",
							minSize: "32%",
							className: "flex min-h-0 flex-col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCanvas, {})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-0 flex-1 flex-col",
					children: tab === "styles" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleGrid, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCanvas, {})
				})
			}),
			hasJobs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobDock, {}) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioWorkspace, {}) });
}
//#endregion
export { Home as component };
