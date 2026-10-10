import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { readAmountFromSlipText } from "./slip-amount";

type SlipWorker = {
  recognize: (image: Buffer) => Promise<{ data: { text: string } }>;
};

type CreateWorker = (
  langs: string,
  oem: number,
  options: {
    workerPath: string;
    langPath: string;
    gzip: boolean;
    cachePath: string;
    errorHandler: () => void;
  },
) => Promise<SlipWorker>;

const globalRef = globalThis as typeof globalThis & { __slipWorker?: Promise<SlipWorker> };

function moduleRoots() {
  return [
    join(process.cwd(), "node_modules"),
    "/var/task/node_modules",
    join(process.cwd(), ".vercel/output/functions/__server.func/node_modules"),
  ];
}

function packageDir(name: string) {
  return (
    moduleRoots()
      .map((root) => join(root, name))
      .find((path) => existsSync(join(path, "package.json"))) ?? null
  );
}

// Load the published CommonJS package directly. The Nitro bundle rewrites
// `import "tesseract.js"` into an ESM shim where `__dirname` is missing, so
// every slip upload died before the amount could be read.
function loadCreateWorker(): CreateWorker {
  const root = packageDir("tesseract.js");
  if (!root) throw new Error("missing tesseract.js");
  const require = createRequire(join(root, "package.json"));
  const loaded = require(root) as { createWorker: CreateWorker };
  return loaded.createWorker;
}

function workerScript() {
  const direct = moduleRoots()
    .map((root) => join(root, "tesseract.js/src/worker-script/node/index.js"))
    .find((path) => existsSync(path));
  if (direct) return direct;
  try {
    const require = createRequire(join(process.cwd(), "package.json"));
    const resolved = require.resolve("tesseract.js/src/worker-script/node/index.js");
    if (existsSync(resolved)) return resolved;
  } catch {
    /* The published bundle does not keep the original package path. */
  }
  return null;
}

function langDir() {
  const dir = "/tmp/rts-tessdata";
  mkdirSync(dir, { recursive: true });
  for (const code of ["eng", "tha"] as const) {
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
      errorHandler: () => undefined,
    });
  })().catch((error) => {
    globalRef.__slipWorker = undefined;
    throw error;
  });
  return globalRef.__slipWorker;
}

export async function readSlipImage(bytes: Buffer) {
  try {
    const worker = await getWorker();
    const { data } = await worker.recognize(bytes);
    return readAmountFromSlipText(data.text);
  } catch (error) {
    console.error("[coffee] slip read failed", error);
    return null;
  }
}
