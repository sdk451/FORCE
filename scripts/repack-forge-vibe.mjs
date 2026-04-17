/**
 * Local/private packaging only: npm pack the @sdk451/vibeforge workspace into private-dist/.
 * Run via: npm run repack-forge-vibe (build + test run first from package.json).
 */
import { mkdirSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dest = path.join(root, "private-dist");
mkdirSync(dest, { recursive: true });

/** shell: true so `npm` resolves on Windows (npm.cmd) and Unix alike */
const r = spawnSync(
  "npm",
  ["pack", "-w", "@sdk451/vibeforge", "--pack-destination", dest],
  { cwd: root, stdio: "inherit", shell: true },
);

if (r.status !== 0) {
  process.exit(r.status ?? 1);
}

const tarballs = readdirSync(dest).filter((f) => f.endsWith(".tgz")).sort();
const latest = tarballs[tarballs.length - 1];
console.log("");
console.log("Local package ready (not published):");
console.log(`  ${path.join(dest, latest)}`);
console.log("");
console.log("Try: npm install -g " + path.join(dest, latest));
