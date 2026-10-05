import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as cn, d as downloadBlob, l as copyToClipboard, w as resizeImageDataUrl } from "./utils-V5r_Ws4e.mjs";
import { C as Download, S as Heart, a as Trash2, t as X, x as ImagePlus } from "../_libs/lucide-react.mjs";
import { y as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as t, c as useStudio, d as peekImageObjectUrl, f as subscribeImageCache, l as getImageBlob, p as userImageRef, u as getImageObjectUrl } from "./router-CpCNZqBL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lightbox-CHvPi9b0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
		const load = () => {
			const cached = peekImageObjectUrl(id);
			if (cached) {
				setUrl(cached);
				return;
			}
			getImageObjectUrl(id).then((next) => {
				if (alive) setUrl(next);
			});
		};
		load();
		const unsub = subscribeImageCache((changed) => {
			if (changed === id) load();
		});
		return () => {
			alive = false;
			unsub();
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
function blobToDataUrl(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("read failed"));
		reader.readAsDataURL(blob);
	});
}
async function useImageAsSubject(imageId) {
	const blob = await getImageBlob(imageId);
	if (!blob) return false;
	const raw = await blobToDataUrl(blob);
	const resized = await resizeImageDataUrl(raw);
	userImageRef.current = resized;
	useStudio.getState().setSubjectNonce();
	useStudio.getState().setStudioTab("styles");
	return true;
}
function clearSubject() {
	userImageRef.current = null;
	useStudio.getState().setSubjectNonce();
}
function setSubjectDataUrl(dataUrl) {
	userImageRef.current = dataUrl;
	useStudio.getState().setSubjectNonce();
}
function Lightbox() {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const id = useStudio((s) => s.lightboxId);
	const setLightbox = useStudio((s) => s.setLightbox);
	const gallery = useStudio((s) => s.gallery);
	const jobs = useStudio((s) => s.jobs);
	const toggleFav = useStudio((s) => s.toggleGalleryFavorite);
	const deleteItem = useStudio((s) => s.deleteGalleryItem);
	const item = id ? gallery.find((g) => g.id === id) : void 0;
	const job = id ? jobs.find((j) => j.imageId === id || j.id === id) : void 0;
	if (!id || !item) return null;
	const current = item;
	const imageId = id;
	const prompt = (job?.promptEn || current.promptEn || "").trim();
	async function download() {
		const blob = await getImageBlob(imageId);
		if (!blob) {
			toast.error(copy.downloadFail);
			return;
		}
		const ext = blob.type.includes("jpeg") || blob.type.includes("jpg") ? "jpg" : blob.type.includes("webp") ? "webp" : "png";
		const filename = `handraw-${current.styleNumber}-${current.id.slice(-8)}.${ext}`;
		if (!await downloadBlob(blob, filename)) toast.error(copy.downloadFail);
	}
	async function copyPrompt() {
		if (!prompt) {
			toast.error(copy.copyFail);
			return;
		}
		if (await copyToClipboard(prompt)) {
			toast.success(copy.copied);
			return;
		}
		toast.error(copy.copyFail);
		try {
			const ta = document.createElement("textarea");
			ta.value = prompt;
			ta.style.cssText = "position:fixed;inset:20% 10%;z-index:80;width:80%;height:40%;padding:12px";
			document.body.appendChild(ta);
			ta.focus();
			ta.select();
			window.setTimeout(() => ta.remove(), 8e3);
		} catch {}
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => {
									useImageAsSubject(current.id).then((ok) => {
										if (ok) {
											toast.success(copy.usedAsSubject);
											setLightbox(null);
											if (pathname.startsWith("/gallery")) navigate({ to: "/" });
										}
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5" }), copy.useAsSubject]
							}),
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
export { clearSubject as a, StoredImage as i, Input as n, setSubjectDataUrl as o, Lightbox as r, useImageAsSubject as s, Button as t };
