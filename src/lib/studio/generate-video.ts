import { createServerFn } from "@tanstack/react-start";
import type { AspectRatio } from "./types";
import { VIDEO_DURATION_MAX, VIDEO_DURATION_MIN } from "./types";
import { getXaiApiKey } from "./xai-key";

const MODEL = "grok-imagine-video-1.5";

export type VideoStart =
  | { ok: true; requestId: string }
  | { ok: false; error: string };

export type VideoPoll =
  | { ok: true; status: "pending" }
  | { ok: true; status: "done"; dataUrl: string }
  | { ok: false; error: string };

function authHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  const raw = await res.text();
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return { error: { message: raw.slice(0, 280) } };
  }
}

function errorMessage(body: Record<string, unknown>, status: number): string {
  const err = body.error as { message?: string } | string | undefined;
  if (typeof err === "string" && err) return err;
  if (err && typeof err === "object" && err.message) return err.message;
  return `xAI error ${status}`;
}

function videoUrl(body: Record<string, unknown>): string | undefined {
  const video = body.video as { url?: string } | undefined;
  const data = body.data as { url?: string }[] | undefined;
  return video?.url || (typeof body.url === "string" ? body.url : undefined) || data?.[0]?.url;
}

export const startStyledVideo = createServerFn({ method: "POST" })
  .validator(
    (input: { imageDataUrl: string; prompt: string; duration: number; aspectRatio: AspectRatio }) =>
      input,
  )
  .handler(async ({ data }): Promise<VideoStart> => {
    const apiKey = await getXaiApiKey();
    if (!apiKey) return { ok: false, error: "AI is not available in this environment" };
    const prompt = data.prompt.trim();
    if (!prompt) return { ok: false, error: "Prompt is required" };
    if (!data.imageDataUrl.startsWith("data:image/")) return { ok: false, error: "Image is required" };
    if (data.imageDataUrl.length > 6_500_000) return { ok: false, error: "Image is too large" };
    const duration = Math.min(
      VIDEO_DURATION_MAX,
      Math.max(VIDEO_DURATION_MIN, Math.round(data.duration) || VIDEO_DURATION_MIN),
    );

    const attempts: Record<string, unknown>[] = [
      { image: { url: data.imageDataUrl } },
      { image: data.imageDataUrl },
    ];
    let last = "Không gửi được video";
    for (const extra of attempts) {
      const res = await fetch("https://api.x.ai/v1/videos/generations", {
        method: "POST",
        headers: authHeaders(apiKey),
        body: JSON.stringify({
          model: MODEL,
          prompt,
          duration,
          resolution: "720p",
          aspect_ratio: data.aspectRatio,
          ...extra,
        }),
      });
      const body = await readJson(res);
      if (!res.ok) {
        last = errorMessage(body, res.status);
        if (res.status === 401 || res.status === 403 || res.status === 429) return { ok: false, error: last };
        continue;
      }
      const ready = videoUrl(body);
      const requestId = String(body.request_id ?? body.id ?? "");
      if (requestId) return { ok: true, requestId };
      if (ready) return { ok: true, requestId: `url:${ready}` };
      last = "API không trả mã video";
    }
    return { ok: false, error: last };
  });

export const pollStyledVideo = createServerFn({ method: "POST" })
  .validator((input: { requestId: string }) => input)
  .handler(async ({ data }): Promise<VideoPoll> => {
    const apiKey = await getXaiApiKey();
    if (!apiKey) return { ok: false, error: "AI is not available in this environment" };
    const requestId = data.requestId;
    let url: string | undefined;
    if (requestId.startsWith("url:")) {
      url = requestId.slice(4);
    } else {
      const res = await fetch(`https://api.x.ai/v1/videos/${requestId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const body = await readJson(res);
      if (!res.ok) return { ok: false, error: errorMessage(body, res.status) };
      const status = String(body.status ?? body.state ?? "").toLowerCase();
      if (status === "failed" || status === "expired" || status === "error") {
        return { ok: false, error: errorMessage(body, res.status) || "Video failed" };
      }
      url = videoUrl(body);
      if (!url && status !== "done" && status !== "completed" && status !== "succeeded") {
        return { ok: true, status: "pending" };
      }
      if (!url) return { ok: false, error: "API không trả video" };
    }

    const file = await fetch(url);
    if (!file.ok) return { ok: false, error: "Không tải được video" };
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.byteLength > 24_000_000) return { ok: false, error: "Video quá lớn" };
    const mime = file.headers.get("content-type")?.split(";")[0] || "video/mp4";
    return { ok: true, status: "done", dataUrl: `data:${mime};base64,${buf.toString("base64")}` };
  });
