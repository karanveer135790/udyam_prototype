//#region browser-src/local-ai.mjs
var e = "HuggingFaceTB/SmolLM2-360M-Instruct", t = null, n = !1, r = 0, i = /* @__PURE__ */ new Map();
function a(e, n = {}, a) {
	let o = ++r;
	return new Promise((r, s) => {
		let l = setTimeout(() => {
			c(), s(/* @__PURE__ */ Error("Local AI timed out. Guided mode remains available."));
		}, e === "load" ? 3e5 : 9e4);
		i.set(o, {
			resolve: r,
			reject: s,
			timer: l,
			progress: a
		}), t.postMessage({
			id: o,
			type: e,
			...n
		});
	});
}
async function o(e) {
	if (!n) {
		if (!globalThis.WebAssembly) throw Error("This browser does not support WebAssembly. Guided mode remains available.");
		t = new Worker(new URL("./local-ai-worker.js",import.meta.url), { type: "module" }), t.onmessage = ({ data: e }) => {
			let t = i.get(e.id);
			if (t) {
				if (e.type === "progress") {
					t.progress?.(e.text, e.progress);
					return;
				}
				clearTimeout(t.timer), i.delete(e.id), e.type === "error" ? t.reject(Error(e.message)) : t.resolve(e.text);
			}
		}, t.onerror = () => c("Local AI could not start. Check the model download connection and retry.");
		try {
			await a("load", {}, e), n = !0;
		} catch (e) {
			throw await c(), e;
		}
	}
}
async function s(e) {
	if (!n) throw Error("Load the model first");
	return a("ask", { messages: e });
}
async function c(e = "Local AI cancelled; guided mode ready.") {
	n = !1, t?.terminate(), t = null;
	for (let t of i.values()) clearTimeout(t.timer), t.reject(Error(e));
	i.clear();
}
async function l() {
	if (await c(), globalThis.caches) for (let e of await caches.keys()) {
		let t = await caches.open(e);
		for (let e of await t.keys()) e.url.includes("/HuggingFaceTB/SmolLM2-360M-Instruct/") && await t.delete(e);
	}
}
//#endregion
export { e as MODEL, s as askLocalAI, l as clearLocalAI, o as loadLocalAI, c as stopLocalAI };
