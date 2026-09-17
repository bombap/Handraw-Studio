import { createServerFn } from "@tanstack/react-start";
import type { EnhanceLevel, Lang } from "./types";

const MODEL = "grok-4.5";

export type EnhanceInput = {
  theme: string;
  lang: Lang;
  level?: EnhanceLevel;
  userImageDataUrl?: string;
};

export type EnhanceResult = { ok: true; theme: string } | { ok: false; error: string };

const LEVEL = {
  short: {
    tokens: 90,
    temperature: 0.45,
    extra:
      "One sentence only. Stay close to the user's wording. Add just the missing visual noun and a single setting clue.",
  },
  full: {
    tokens: 220,
    temperature: 0.7,
    extra: "1–3 sentences. Compact. Add setting, lighting, materials, pose, and two telling details.",
  },
  cinematic: {
    tokens: 380,
    temperature: 0.85,
    extra:
      "3–5 sentences. Specify light direction, time of day, materials, atmosphere, and a quiet narrative beat. Still compact, not purple.",
  },
} as const;

function systemPrompt(lang: Lang, hasImage: boolean, level: EnhanceLevel): string {
  const language = lang === "vi" ? "Vietnamese" : "English";
  const imageBit = hasImage
    ? "A subject photo is attached. Preserve the person's/object's identity and key props. If the theme is empty, describe that photo as a scene to restyle. If the theme has content, place the photo's subject into that scene."
    : "No photo is attached — invent only from the written theme.";
  return [
    "You rewrite a short illustration THEME into a richer visual scene.",
    "Output ONLY the rewritten theme. No quotes, labels, markdown, or preamble.",
    `Write in ${language}.`,
    "Keep the original subject, names, and intent.",
    LEVEL[level].extra,
    "Do NOT mention art style, medium, artist, camera, rendering, illustration, prompt, or AI — style is applied separately.",
    imageBit,
  ].join(" ");
}

function cleanTheme(text: string): string {
  return text
    .trim()
    .replace(/^```[\w]*\n?|\n?```$/g, "")
    .replace(/^["'“”«»]|["'“”«»]$/g, "")
    .replace(/^(theme|chủ đề)\s*[:：]\s*/i, "")
    .trim();
}

export const enhanceTheme = createServerFn({ method: "POST" })
  .validator((input: EnhanceInput) => input)
  .handler(async ({ data }): Promise<EnhanceResult> => {
    const apiKey = process.env.XAI_API_KEY?.trim();
    if (!apiKey) return { ok: false, error: "unavailable" };

    const theme = data.theme.trim();
    const hasImage = Boolean(data.userImageDataUrl);
    const level: EnhanceLevel = data.level === "short" || data.level === "cinematic" ? data.level : "full";
    if (!theme && !hasImage) return { ok: false, error: "needTheme" };
    if (data.userImageDataUrl && data.userImageDataUrl.length > 3_500_000) {
      return { ok: false, error: "imageTooLarge" };
    }

    const userText = theme
      ? `Theme: ${theme}`
      : "Theme is empty. Describe the attached photo as a restyle scene.";

    const userContent: unknown = hasImage
      ? [
          { type: "text", text: userText },
          { type: "image_url", image_url: { url: data.userImageDataUrl } },
        ]
      : userText;

    const spec = LEVEL[level];
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: spec.temperature,
        max_tokens: spec.tokens,
        messages: [
          { role: "system", content: systemPrompt(data.lang, hasImage, level) },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!res.ok) {
      const raw = await res.text();
      return { ok: false, error: raw.slice(0, 200) || `xAI error ${res.status}` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const next = cleanTheme(body.choices?.[0]?.message?.content ?? "");
    if (!next) return { ok: false, error: "empty" };
    return { ok: true, theme: next };
  });
