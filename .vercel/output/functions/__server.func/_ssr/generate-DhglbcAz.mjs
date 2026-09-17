import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as shouldUseStyleReference, i as getStyle, n as buildPrompts } from "./prompt-DPJN2OUm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-DhglbcAz.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MODEL = "grok-imagine-image-2.0";
var FALLBACK_MODEL = "grok-imagine-image-quality";
function stylePreviewUrl(number) {
	return `https://cdn.jsdelivr.net/gh/yang0/handraw-style@master/images/individual/${Number.parseInt(number, 10) <= 200 ? "001-200" : "201-400"}/${number}.png`;
}
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
	const useStyleRef = shouldUseStyleReference();
	const { zh, en } = buildPrompts({
		style,
		theme: input.theme,
		aspectRatio: input.aspectRatio,
		hasUserImage: Boolean(input.userImageDataUrl),
		useStyleRef
	});
	const refs = [];
	if (input.userImageDataUrl) refs.push(imageRef(input.userImageDataUrl));
	if (useStyleRef) refs.push(imageRef(stylePreviewUrl(style.number)));
	const shared = {
		model,
		prompt: en,
		n: 1,
		aspect_ratio: input.aspectRatio,
		resolution: input.resolution === "2k" ? "2k" : "1k"
	};
	let result;
	if (refs.length === 0) result = await callXai(apiKey, shared, "/images/generations");
	else if (refs.length === 1) {
		result = await callXai(apiKey, {
			...shared,
			image: refs[0]
		}, "/images/edits");
		if (!result.ok && /image|images/i.test(result.error)) result = await callXai(apiKey, {
			...shared,
			images: refs
		}, "/images/edits");
	} else {
		result = await callXai(apiKey, {
			...shared,
			images: refs
		}, "/images/edits");
		if (!result.ok) result = await callXai(apiKey, {
			...shared,
			image: refs
		}, "/images/edits");
	}
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
	const apiKey = process.env.XAI_API_KEY?.trim();
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const theme = data.theme.trim();
	if (!theme) return {
		ok: false,
		error: "Theme is required"
	};
	if (!/^\d{3}$/.test(data.styleNumber)) return {
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
	return { available: Boolean(process.env.XAI_API_KEY?.trim()) };
});
//#endregion
export { checkAiAvailable_createServerFn_handler, generateStyledImage_createServerFn_handler };
