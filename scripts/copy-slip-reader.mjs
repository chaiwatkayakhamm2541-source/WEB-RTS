import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const func = join(root, ".vercel/output/functions/__server.func");
if (!existsSync(func)) {
  console.error("[slip-reader] function output is missing");
  process.exit(1);
}

const dest = join(func, "node_modules");
mkdirSync(dest, { recursive: true });
const copied = new Set();

function copyPackage(name) {
  if (copied.has(name)) return;
  const source = join(root, "node_modules", name);
  if (!existsSync(join(source, "package.json"))) {
    console.error(`[slip-reader] missing package ${name}`);
    process.exit(1);
  }
  copied.add(name);
  cpSync(source, join(dest, name), { recursive: true });
  const pkg = JSON.parse(readFileSync(join(source, "package.json"), "utf8"));
  for (const dependency of Object.keys(pkg.dependencies ?? {})) copyPackage(dependency);
}

for (const name of ["tesseract.js", "tesseract.js-core", "@tesseract.js-data/eng", "@tesseract.js-data/tha"]) {
  copyPackage(name);
}

const configPath = join(func, ".vc-config.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
config.maxDuration = 60;
config.memory = 1024;
writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`[slip-reader] packaged ${copied.size} packages`);
