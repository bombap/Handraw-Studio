import { n as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/xai-key-BEpxXzzf.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Preview sessions sometimes omit XAI_API_KEY. The workspace login token in
* auth.json has api:access and is accepted by api.x.ai. Deployed apps still
* use the injected key. Never return this value to the browser.
*/
async function getXaiApiKey() {
	const fromEnv = process.env.XAI_API_KEY?.trim();
	if (fromEnv) return fromEnv;
	try {
		const { readFileSync } = await import("node:fs");
		const raw = readFileSync("/root/.grok/auth.json", "utf8");
		const data = JSON.parse(raw);
		const now = Date.now();
		let best;
		for (const entry of Object.values(data)) {
			const key = entry?.key?.trim();
			if (!key) continue;
			const exp = entry.expires_at ? Date.parse(entry.expires_at) : Number.POSITIVE_INFINITY;
			if (!Number.isFinite(exp) || exp < now + 15e3) continue;
			if (!best || exp > best.exp) best = {
				key,
				exp
			};
		}
		return best?.key;
	} catch {
		return;
	}
}
//#endregion
export { getXaiApiKey as n, createServerRpc as t };
