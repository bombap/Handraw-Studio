import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-OVG4zYKs.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
async function resizeImageDataUrl(dataUrl, maxEdge = 1280, quality = .86) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
			const w = Math.max(1, Math.round(img.width * scale));
			const h = Math.max(1, Math.round(img.height * scale));
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				resolve(dataUrl);
				return;
			}
			ctx.drawImage(img, 0, 0, w, h);
			resolve(canvas.toDataURL("image/jpeg", quality));
		};
		img.onerror = () => reject(/* @__PURE__ */ new Error("Không đọc được ảnh đính kèm"));
		img.src = dataUrl;
	});
}
function dataUrlToBlob(dataUrl) {
	const [header, b64] = dataUrl.split(",");
	const mime = /data:(.*?);/.exec(header ?? "")?.[1] ?? "image/png";
	const binary = atob(b64 ?? "");
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return new Blob([bytes], { type: mime });
}
function formatDuration(ms) {
	if (!Number.isFinite(ms) || ms < 0) return "0s";
	const s = Math.round(ms / 1e3);
	if (s < 60) return `${s}s`;
	return `${Math.floor(s / 60)}m ${s % 60}s`;
}
//#endregion
export { uid as a, resizeImageDataUrl as i, dataUrlToBlob as n, formatDuration as r, cn as t };
