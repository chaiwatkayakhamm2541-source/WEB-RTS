import { n as readAmountFromSlipText } from "./slip-amount-DnHvMVXQ.mjs";
import { createRequire } from "node:module";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/slip-ocr.server-Dl_4zITn.js
var globalRef = globalThis;
function moduleRoots() {
	return [
		join(process.cwd(), "node_modules"),
		"/var/task/node_modules",
		join(process.cwd(), ".vercel/output/functions/__server.func/node_modules")
	];
}
function packageDir(name) {
	return moduleRoots().map((root) => join(root, name)).find((path) => existsSync(join(path, "package.json"))) ?? null;
}
function loadCreateWorker() {
	const root = packageDir("tesseract.js");
	if (!root) throw new Error("missing tesseract.js");
	return createRequire(join(root, "package.json"))(root).createWorker;
}
function workerScript() {
	const direct = moduleRoots().map((root) => join(root, "tesseract.js/src/worker-script/node/index.js")).find((path) => existsSync(path));
	if (direct) return direct;
	try {
		const resolved = createRequire(join(process.cwd(), "package.json")).resolve("tesseract.js/src/worker-script/node/index.js");
		if (existsSync(resolved)) return resolved;
	} catch {}
	return null;
}
function langDir() {
	const dir = "/tmp/rts-tessdata";
	mkdirSync(dir, { recursive: true });
	for (const code of ["eng", "tha"]) {
		const dest = join(dir, `${code}.traineddata.gz`);
		if (existsSync(dest)) continue;
		const source = packageDir(`@tesseract.js-data/${code}`);
		const file = source ? join(source, "4.0.0", `${code}.traineddata.gz`) : "";
		if (!file || !existsSync(file)) throw new Error(`missing ${code} traineddata`);
		copyFileSync(file, dest);
	}
	return dir;
}
function getWorker() {
	globalRef.__slipWorker ??= (async () => {
		const workerPath = workerScript();
		if (!workerPath) throw new Error("missing slip worker");
		return loadCreateWorker()("tha+eng", 1, {
			workerPath,
			langPath: langDir(),
			gzip: true,
			cachePath: "/tmp/tess-cache",
			errorHandler: () => void 0
		});
	})().catch((error) => {
		globalRef.__slipWorker = void 0;
		throw error;
	});
	return globalRef.__slipWorker;
}
async function readSlipImage(bytes) {
	try {
		const { data } = await (await getWorker()).recognize(bytes);
		return readAmountFromSlipText(data.text);
	} catch (error) {
		console.error("[coffee] slip read failed", error);
		return null;
	}
}
//#endregion
export { readSlipImage };
