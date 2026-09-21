import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ASPECT_OPTIONS, type AspectRatio } from "@/lib/studio/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function makeSeed(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(16).padStart(8, "0");
  }
  return Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, "0");
}

export function seedToInt(seed: string): number {
  const n = Number.parseInt(seed.replace(/[^a-f0-9]/gi, "").slice(0, 8) || "1", 16);
  return Number.isFinite(n) ? n >>> 0 : 1;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  const value = text.trim();
  if (!value) return false;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, value.length);
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export async function downloadBlob(blob: Blob, filename: string): Promise<boolean> {
  const file = new File([blob], filename, { type: blob.type || "image/png" });
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  if (coarse && typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return true;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return false;
    }
  }
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    window.setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 1500);
    return true;
  } catch {
    return false;
  }
}

export async function resizeImageDataUrl(
  dataUrl: string,
  maxEdge = 1280,
  quality = 0.86,
): Promise<string> {
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
    img.onerror = () => reject(new Error("Không đọc được ảnh đính kèm"));
    img.src = dataUrl;
  });
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, b64] = dataUrl.split(",");
  const mime = /data:(.*?);/.exec(header ?? "")?.[1] ?? "image/png";
  const binary = atob(b64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "0s";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

export function nearestAspect(width: number, height: number): AspectRatio {
  const r = width / Math.max(height, 1);
  let best: AspectRatio = "1:1";
  let bestDelta = Infinity;
  for (const opt of ASPECT_OPTIONS) {
    const delta = Math.abs(opt.w / opt.h - r);
    if (delta < bestDelta) {
      best = opt.id;
      bestDelta = delta;
    }
  }
  return best;
}

export function extractClipboardImage(e: { clipboardData: DataTransfer | null }): File | null {
  const dt = e.clipboardData;
  if (!dt) return null;
  for (const item of Array.from(dt.items ?? [])) {
    if (item.type.startsWith("image/")) return item.getAsFile();
  }
  for (const file of Array.from(dt.files ?? [])) {
    if (file.type.startsWith("image/")) return file;
  }
  return null;
}

export function imageSizeFromDataUrl(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("bad image"));
    img.src = dataUrl;
  });
}
