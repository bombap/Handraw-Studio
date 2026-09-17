import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-OVG4zYKs.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { h as Heart, o as Search } from "../_libs/lucide-react.mjs";
import { a as Lightbox, c as t, i as Input, l as useStudio, n as AppShell, o as StoredImage } from "./lightbox-DOZGoTkJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gallery-BApFSrB9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GalleryView() {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const gallery = useStudio((s) => s.gallery);
	const setLightbox = useStudio((s) => s.setLightbox);
	const toggleFav = useStudio((s) => s.toggleGalleryFavorite);
	const [q, setQ] = (0, import_react.useState)("");
	const [onlyFav, setOnlyFav] = (0, import_react.useState)(false);
	const items = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return gallery.filter((g) => {
			if (onlyFav && !g.favorite) return false;
			if (!query) return true;
			return g.styleNumber.includes(query) || g.styleName.toLowerCase().includes(query) || g.theme.toLowerCase().includes(query);
		});
	}, [
		gallery,
		q,
		onlyFav
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 border-b border-line px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: copy.gallery
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-ink-muted tabular-nums",
					children: [
						items.length,
						copy.of,
						gallery.length
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col gap-2 sm:max-w-md sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: copy.searchGallery,
							className: "pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOnlyFav(!onlyFav),
						className: cn("inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm", onlyFav ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-3.5", onlyFav && "fill-current") }), copy.filterFav]
					})]
				})]
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: copy.emptyGallery
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-muted",
					children: copy.emptyGalleryHint
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-4 xl:grid-cols-5",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group overflow-hidden rounded-xl bg-surface p-1 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "block w-full overflow-hidden rounded-lg",
						onClick: () => setLightbox(item.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoredImage, {
							id: item.id,
							alt: `#${item.styleNumber} ${item.theme}`,
							className: "aspect-square w-full"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2 px-2.5 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate font-mono text-xs tabular-nums",
								children: ["#", item.styleNumber]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-ink-muted",
								children: item.theme
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-8 shrink-0 items-center justify-center text-ink-subtle hover:text-stamp",
							onClick: () => toggleFav(item.id),
							"aria-label": copy.favorites,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-3.5", item.favorite && "fill-stamp text-stamp") })
						})]
					})]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbox, {})
		]
	});
}
function GalleryPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryView, {}) });
}
//#endregion
export { GalleryPage as component };
