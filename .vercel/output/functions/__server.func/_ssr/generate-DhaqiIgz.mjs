import { t as createServerFn } from "./ssr.mjs";
import { n as getXaiApiKey, t as createServerRpc } from "./xai-key-BEpxXzzf.mjs";
import { C as promptForImage, D as stylePreviewUrl, E as shouldUseStyleReference, T as seedToInt, _ as getLayout, b as layoutPreviewUrl, g as getColor, s as buildPrompts, v as getStyle } from "./utils-V5r_Ws4e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-DhaqiIgz.js
var MODEL = "grok-imagine-image-2.0";
var FALLBACK_MODEL = "grok-imagine-image-quality";
function imageRef(url) {
	return {
		url,
		type: "image_url"
	};
}
async function callXai(apiKey, body, path) {
	const res = await fetch(`https://api.x.ai/v1${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify(body)
	});
	const raw = await res.text();
	let parsed = {};
	try {
		parsed = JSON.parse(raw);
	} catch {
		parsed = {};
	}
	if (!res.ok) {
		const msg = parsed.error?.message || raw.slice(0, 280) || `xAI error ${res.status}`;
		return {
			ok: false,
			status: res.status,
			error: msg
		};
	}
	const url = parsed.data?.[0]?.url || (parsed.data?.[0]?.b64_json ? `data:image/png;base64,${parsed.data[0].b64_json}` : void 0) || parsed.url;
	if (!url) return {
		ok: false,
		status: res.status,
		error: "API không trả về ảnh"
	};
	return {
		ok: true,
		url
	};
}
function isFatalStatus(status, error) {
	if (status === 401 || status === 403 || status === 429) return true;
	return /quota|rate limit|insufficient/i.test(error);
}
/** Imagine edits: `image` is a URL string or string[]; objects `{url,type}` only work as a single `image`. */
async function editWithRefs(apiKey, shared, urls) {
	const attempts = [];
	if (urls.length === 1) {
		attempts.push({ image: {
			url: urls[0],
			type: "image_url"
		} });
		attempts.push({ image: urls[0] });
	} else {
		attempts.push({ image: urls });
		attempts.push({ images: urls.map((url) => ({ url })) });
		attempts.push({ images: urls.map((url) => imageRef(url)) });
	}
	let last;
	for (const extra of attempts) {
		last = await callXai(apiKey, {
			...shared,
			...extra
		}, "/images/edits");
		if (last.ok) return last;
		if (isFatalStatus(last.status, last.error)) return last;
	}
	return last ?? {
		ok: false,
		status: 0,
		error: "Không gửi được ảnh tham chiếu"
	};
}
async function urlToDataUrl(url) {
	if (url.startsWith("data:")) return url;
	const res = await fetch(url);
	if (!res.ok) throw new Error("Không tải được ảnh kết quả");
	const buf = Buffer.from(await res.arrayBuffer());
	return `data:${res.headers.get("content-type")?.split(";")[0] || "image/png"};base64,${buf.toString("base64")}`;
}
async function generateOnce(apiKey, model, input) {
	const style = getStyle(input.styleNumber);
	if (!style) return {
		ok: false,
		error: `Không có style #${input.styleNumber}`
	};
	const layout = getLayout(input.layoutId);
	const color = getColor(input.colorId);
	const useStyleRef = shouldUseStyleReference();
	const { zh, en } = buildPrompts({
		style,
		theme: input.theme,
		aspectRatio: input.aspectRatio,
		hasUserImage: Boolean(input.userImageDataUrl),
		useStyleRef,
		characterLock: input.characterLock,
		copyIndex: input.copyIndex,
		copies: input.copies,
		seed: input.seed,
		layout,
		color
	});
	const urls = [];
	if (input.userImageDataUrl) urls.push(input.userImageDataUrl);
	if (layout) urls.push(layoutPreviewUrl(layout.id, layout.category));
	if (useStyleRef) urls.push(stylePreviewUrl(style.number));
	const refs = urls.slice(0, 3);
	const shared = {
		model,
		prompt: promptForImage(zh, en, input.theme),
		n: 1,
		aspect_ratio: input.aspectRatio,
		resolution: input.resolution === "2k" ? "2k" : "1k"
	};
	if (input.seed) shared.seed = seedToInt(input.seed);
	const result = refs.length === 0 ? await callXai(apiKey, shared, "/images/generations") : await editWithRefs(apiKey, shared, refs);
	if (!result.ok) return {
		ok: false,
		error: result.error,
		promptEn: en,
		promptZh: zh
	};
	try {
		return {
			ok: true,
			dataUrl: await urlToDataUrl(result.url),
			promptEn: en,
			promptZh: zh,
			usedStyleRef: useStyleRef
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Không lưu được ảnh",
			promptEn: en,
			promptZh: zh
		};
	}
}
var generateStyledImage_createServerFn_handler = createServerRpc({
	id: "d23950bc48f6fb0181df135e34b5c0c093e51e1b3dd59cf4b814ced3b94ccf26",
	name: "generateStyledImage",
	filename: "src/lib/studio/generate.ts"
}, (opts) => generateStyledImage.__executeServer(opts));
var generateStyledImage = createServerFn({ method: "POST" }).validator((input) => input).handler(generateStyledImage_createServerFn_handler, async ({ data }) => {
	const apiKey = await getXaiApiKey();
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const theme = data.theme.trim();
	if (!theme) return {
		ok: false,
		error: "Theme is required"
	};
	if (!/^(?:FA|FB|FC|FD|FE|FF|FG|FH)-\d{3}$/.test(data.styleNumber)) return {
		ok: false,
		error: "Invalid style number"
	};
	if (data.userImageDataUrl && data.userImageDataUrl.length > 65e5) return {
		ok: false,
		error: "Attached image is too large"
	};
	let result = await generateOnce(apiKey, MODEL, {
		...data,
		theme
	});
	if (!result.ok && /model/i.test(result.error)) result = await generateOnce(apiKey, FALLBACK_MODEL, {
		...data,
		theme
	});
	return result;
});
var checkAiAvailable_createServerFn_handler = createServerRpc({
	id: "9954c43fd601ae948e4679f42e17f11705eab224b805183bbfa7d935436c25eb",
	name: "checkAiAvailable",
	filename: "src/lib/studio/generate.ts"
}, (opts) => checkAiAvailable.__executeServer(opts));
var checkAiAvailable = createServerFn({ method: "POST" }).handler(checkAiAvailable_createServerFn_handler, async () => {
	return { available: Boolean(await getXaiApiKey()) };
});
//#endregion
export { checkAiAvailable_createServerFn_handler, generateStyledImage_createServerFn_handler };
