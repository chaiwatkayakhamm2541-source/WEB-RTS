import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C78tn_v0.mjs";
import { i as createSsrRpc } from "./site-page-jwH4mGfv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/registrations-gTxoIMN2.js
var alliances = [
	"IMT",
	"FOX",
	"UNS"
];
var servers = Array.from({ length: 15 }, (_, index) => `S1-${String(index + 1).padStart(3, "0")}`);
function clean(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	const next = {
		character: typeof row.character === "string" ? row.character.trim() : "",
		discord: typeof row.discord === "string" ? row.discord.trim() : "",
		uid: typeof row.uid === "string" ? row.uid.trim() : "",
		alliance: typeof row.alliance === "string" ? row.alliance.trim() : "",
		server: typeof row.server === "string" ? row.server.trim() : "",
		updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : (/* @__PURE__ */ new Date()).toISOString()
	};
	if (!next.character || next.character.length > 40) return null;
	if (!next.discord || next.discord.length > 40) return null;
	if (!/^\d{1,20}$/.test(next.uid)) return null;
	if (!alliances.includes(next.alliance)) return null;
	if (!servers.includes(next.server)) return null;
	return next;
}
var submitRegistration = createServerFn({ method: "POST" }).inputValidator((data) => {
	const row = clean(data);
	if (!row) throw new Error("ข้อมูลไม่ถูกต้อง");
	return row;
}).handler(createSsrRpc("ea13a9fb87be0aefd3f7ad2f631571244b703771b3ec4dd47656a2be3be7a919"));
var listRegistrations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("68b8225318268cc00b4ecc9c33cc0f7148b2b10cbed7fce2ab29d323d6c6645a"));
//#endregion
export { submitRegistration as n, listRegistrations as t };
