import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C78tn_v0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CxxNWg1L.js
function cleanName(value) {
	const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
	if (name.length < 1 || name.length > 48) return "";
	return name;
}
function cleanProfile(data) {
	if (!data || typeof data !== "object") return null;
	const row = data;
	const name = cleanName(row.name);
	if (!name) return null;
	if (row.image == null || row.image === "") return {
		name,
		image: null
	};
	if (typeof row.image !== "string" || !row.image.startsWith("data:image/jpeg;base64,")) return null;
	return {
		name,
		image: row.image
	};
}
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "9127db612637fd95c76b6b1a0d95e5c0dd7fcd6f98feeb020f98278811c51c63",
	name: "getMyProfile",
	filename: "src/lib/profile.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const { readProfile } = await import("./profile.server-BY0RR1Hq.mjs");
	return readProfile(context.userId);
});
var saveMyProfile_createServerFn_handler = createServerRpc({
	id: "39418c55286ff0aeac7d639c6187fd85d88510a23d881248b6bdd21ce02ee68a",
	name: "saveMyProfile",
	filename: "src/lib/profile.ts"
}, (opts) => saveMyProfile.__executeServer(opts));
var saveMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((data) => cleanProfile(data) ?? {
	name: "",
	image: null
}).handler(saveMyProfile_createServerFn_handler, async ({ data, context }) => {
	if (!data.name) return {
		ok: false,
		error: "invalid"
	};
	const { writeProfile } = await import("./profile.server-BY0RR1Hq.mjs");
	try {
		return await writeProfile(context.userId, data.name, data.image);
	} catch (error) {
		console.error("[profile] save failed", error);
		return {
			ok: false,
			error: "failed"
		};
	}
});
//#endregion
export { getMyProfile_createServerFn_handler, saveMyProfile_createServerFn_handler };
