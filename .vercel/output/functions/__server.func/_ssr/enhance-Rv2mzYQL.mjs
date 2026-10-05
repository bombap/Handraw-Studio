import { t as createServerFn } from "./ssr.mjs";
import { n as getXaiApiKey, t as createServerRpc } from "./xai-key-BEpxXzzf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enhance-Rv2mzYQL.js
var MODEL = "grok-4.5";
var LEVEL = {
	short: {
		tokens: 90,
		temperature: .45,
		extra: "One sentence only. Stay close to the user's wording. Add just the missing visual noun and a single setting clue."
	},
	full: {
		tokens: 220,
		temperature: .7,
		extra: "1–3 sentences. Compact. Add setting, lighting, materials, pose, and two telling details."
	},
	cinematic: {
		tokens: 380,
		temperature: .85,
		extra: "3–5 sentences. Specify light direction, time of day, materials, atmosphere, and a quiet narrative beat. Still compact, not purple."
	}
};
function systemPrompt(lang, hasImage, level) {
	const language = lang === "vi" ? "Vietnamese" : "English";
	const imageBit = hasImage ? "A subject photo is attached. Preserve the person's/object's identity and key props. If the theme is empty, describe that photo as a scene to restyle. If the theme has content, place the photo's subject into that scene." : "No photo is attached — invent only from the written theme.";
	return [
		"You rewrite a short illustration THEME into a richer visual scene.",
		"Output ONLY the rewritten theme. No quotes, labels, markdown, or preamble.",
		`Write in ${language}.`,
		"Keep the original subject, names, and intent.",
		LEVEL[level].extra,
		"Do NOT mention art style, medium, artist, camera, rendering, illustration, prompt, or AI — style is applied separately.",
		imageBit
	].join(" ");
}
function cleanTheme(text) {
	return text.trim().replace(/^```[\w]*\n?|\n?```$/g, "").replace(/^["'“”«»]|["'“”«»]$/g, "").replace(/^(theme|chủ đề)\s*[:：]\s*/i, "").trim();
}
var enhanceTheme_createServerFn_handler = createServerRpc({
	id: "fba64eee0b78b2d774caf8a3ae991a968e84c563c7f81577a075046525ab56c6",
	name: "enhanceTheme",
	filename: "src/lib/studio/enhance.ts"
}, (opts) => enhanceTheme.__executeServer(opts));
var enhanceTheme = createServerFn({ method: "POST" }).validator((input) => input).handler(enhanceTheme_createServerFn_handler, async ({ data }) => {
	const apiKey = await getXaiApiKey();
	if (!apiKey) return {
		ok: false,
		error: "unavailable"
	};
	const theme = data.theme.trim();
	const hasImage = Boolean(data.userImageDataUrl);
	const level = data.level === "short" || data.level === "cinematic" ? data.level : "full";
	if (!theme && !hasImage) return {
		ok: false,
		error: "needTheme"
	};
	if (data.userImageDataUrl && data.userImageDataUrl.length > 35e5) return {
		ok: false,
		error: "imageTooLarge"
	};
	const userText = theme ? `Theme: ${theme}` : "Theme is empty. Describe the attached photo as a restyle scene.";
	const userContent = hasImage ? [{
		type: "text",
		text: userText
	}, {
		type: "image_url",
		image_url: { url: data.userImageDataUrl }
	}] : userText;
	const spec = LEVEL[level];
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: MODEL,
			temperature: spec.temperature,
			max_tokens: spec.tokens,
			messages: [{
				role: "system",
				content: systemPrompt(data.lang, hasImage, level)
			}, {
				role: "user",
				content: userContent
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: (await res.text()).slice(0, 200) || `xAI error ${res.status}`
	};
	const next = cleanTheme((await res.json()).choices?.[0]?.message?.content ?? "");
	if (!next) return {
		ok: false,
		error: "empty"
	};
	return {
		ok: true,
		theme: next
	};
});
//#endregion
export { enhanceTheme_createServerFn_handler };
