import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C78tn_v0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coffee-LFk-GqUN.js
function clean(data) {
	if (!data || typeof data !== "object") return null;
	const row = data;
	const imageHash = typeof row.imageHash === "string" ? row.imageHash.trim().toLowerCase() : "";
	const image = typeof row.image === "string" ? row.image.replace(/\s/g, "") : "";
	if (!/^[a-f0-9]{64}$/.test(imageHash)) return null;
	if (image.length < 100 || image.length > 16e5 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image)) return null;
	return {
		imageHash,
		image
	};
}
var listCoffee_createServerFn_handler = createServerRpc({
	id: "8a874b03f5b854b22afc1e5c6cfb593a614267bc413ec1750180aabe5e0bc96d",
	name: "listCoffee",
	filename: "src/lib/coffee.ts"
}, (opts) => listCoffee.__executeServer(opts));
var listCoffee = createServerFn({ method: "GET" }).handler(listCoffee_createServerFn_handler, async () => {
	const { listCoffeeRanks } = await import("./coffee.server-BTjcJBKy.mjs");
	return listCoffeeRanks();
});
var listCoffeeAccounts_createServerFn_handler = createServerRpc({
	id: "a0447c38d8569780af6c7e6ddc17ac7f0c0cd4c457258dcc0597ba526029a8d2",
	name: "listCoffeeAccounts",
	filename: "src/lib/coffee.ts"
}, (opts) => listCoffeeAccounts.__executeServer(opts));
var listCoffeeAccounts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCoffeeAccounts_createServerFn_handler, async ({ context }) => {
	const { listCoffeeAccounts: load } = await import("./coffee.server-BTjcJBKy.mjs");
	return load(context.userId);
});
var submitCoffee_createServerFn_handler = createServerRpc({
	id: "b4e9a7960fe4bd3b7585c85df86c39d000404f1c7094f0d44020e16b32c361ff",
	name: "submitCoffee",
	filename: "src/lib/coffee.ts"
}, (opts) => submitCoffee.__executeServer(opts));
var submitCoffee = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((data) => clean(data) ?? {
	imageHash: "",
	image: ""
}).handler(submitCoffee_createServerFn_handler, async ({ data, context }) => {
	if (!data.imageHash || !data.image) return {
		ok: false,
		error: "invalid"
	};
	const { addCoffeeSlip } = await import("./coffee.server-BTjcJBKy.mjs");
	return addCoffeeSlip(context.userId, data.imageHash, data.image);
});
//#endregion
export { listCoffeeAccounts_createServerFn_handler, listCoffee_createServerFn_handler, submitCoffee_createServerFn_handler };
