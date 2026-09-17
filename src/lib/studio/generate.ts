import { createServerFn } from "@tanstack/react-start";
import { getStyle } from "./catalog";
import { buildPrompts, shouldUseStyleReference } from "./prompt";
import type { AspectRatio, Resolution } from "./types";

const MODEL = "grok-imagine-image-2.0";
const FALLBACK_MODEL = "grok-imagine-image-quality";

export type GenerateInput = {
  styleNumber: string;
  theme: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  userImageDataUrl?: string;
  characterLock?: boolean;
};

export type GenerateResult =
  | {
      ok: true;
      dataUrl: string;
      promptEn: string;
      promptZh: string;
      usedStyleRef: boolean;
    }
  | { ok: false; error: string; promptEn?: string; promptZh?: string };

function stylePreviewUrl(number: string): string {
  const n = Number.parseInt(number, 10);
  const bucket = n <= 200 ? "001-200" : "201-400";
  return `https://cdn.jsdelivr.net/gh/yang0/handraw-style@master/images/individual/${bucket}/${number}.png`;
}

function imageRef(url: string) {
  return { url, type: "image_url" as const };
}

async function callXai(
  apiKey: string,
  body: Record<string, unknown>,
  path: "/images/generations" | "/images/edits",
): Promise<{ ok: true; url: string } | { ok: false; status: number; error: string }> {
  const res = await fetch(`https://api.x.ai/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  let parsed: {
    data?: { url?: string; b64_json?: string }[];
    error?: { message?: string };
    url?: string;
  } = {};
  try {
    parsed = JSON.parse(raw) as typeof parsed;
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed.error?.message || raw.slice(0, 280) || `xAI error ${res.status}`;
    return { ok: false, status: res.status, error: msg };
  }
  const url =
    parsed.data?.[0]?.url ||
    (parsed.data?.[0]?.b64_json ? `data:image/png;base64,${parsed.data[0].b64_json}` : undefined) ||
    parsed.url;
  if (!url) return { ok: false, status: res.status, error: "API không trả về ảnh" };
  return { ok: true, url };
}

async function urlToDataUrl(url: string): Promise<string> {
  if (url.startsWith("data:")) return url;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không tải được ảnh kết quả");
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = res.headers.get("content-type")?.split(";")[0] || "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

async function generateOnce(
  apiKey: string,
  model: string,
  input: GenerateInput,
): Promise<GenerateResult> {
  const style = getStyle(input.styleNumber);
  if (!style) return { ok: false, error: `Không có style #${input.styleNumber}` };

  const useStyleRef = shouldUseStyleReference();
  const { zh, en } = buildPrompts({
    style,
    theme: input.theme,
    aspectRatio: input.aspectRatio,
    hasUserImage: Boolean(input.userImageDataUrl),
    useStyleRef,
    characterLock: input.characterLock,
  });

  const refs: { url: string; type: "image_url" }[] = [];
  if (input.userImageDataUrl) refs.push(imageRef(input.userImageDataUrl));
  if (useStyleRef) refs.push(imageRef(stylePreviewUrl(style.number)));

  const shared = {
    model,
    prompt: en,
    n: 1,
    aspect_ratio: input.aspectRatio,
    resolution: input.resolution === "2k" ? "2k" : "1k",
  };

  let result: Awaited<ReturnType<typeof callXai>>;
  if (refs.length === 0) {
    result = await callXai(apiKey, shared, "/images/generations");
  } else if (refs.length === 1) {
    result = await callXai(apiKey, { ...shared, image: refs[0] }, "/images/edits");
    if (!result.ok && /image|images/i.test(result.error)) {
      result = await callXai(apiKey, { ...shared, images: refs }, "/images/edits");
    }
  } else {
    result = await callXai(apiKey, { ...shared, images: refs }, "/images/edits");
    if (!result.ok) {
      result = await callXai(apiKey, { ...shared, image: refs }, "/images/edits");
    }
  }

  if (!result.ok) {
    return { ok: false, error: result.error, promptEn: en, promptZh: zh };
  }

  try {
    const dataUrl = await urlToDataUrl(result.url);
    return { ok: true, dataUrl, promptEn: en, promptZh: zh, usedStyleRef: useStyleRef };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Không lưu được ảnh",
      promptEn: en,
      promptZh: zh,
    };
  }
}

export const generateStyledImage = createServerFn({ method: "POST" })
  .validator((input: GenerateInput) => input)
  .handler(async ({ data }): Promise<GenerateResult> => {
    const apiKey = process.env.XAI_API_KEY?.trim();
    if (!apiKey) {
      return { ok: false, error: "AI is not available in this environment" };
    }
    const theme = data.theme.trim();
    if (!theme) return { ok: false, error: "Theme is required" };
    if (!/^\d{3}$/.test(data.styleNumber)) {
      return { ok: false, error: "Invalid style number" };
    }
    if (data.userImageDataUrl && data.userImageDataUrl.length > 6_500_000) {
      return { ok: false, error: "Attached image is too large" };
    }

    let result = await generateOnce(apiKey, MODEL, { ...data, theme });
    if (!result.ok && /model/i.test(result.error)) {
      result = await generateOnce(apiKey, FALLBACK_MODEL, { ...data, theme });
    }
    return result;
  });

export const checkAiAvailable = createServerFn({ method: "POST" }).handler(async () => {
  return { available: Boolean(process.env.XAI_API_KEY?.trim()) };
});
