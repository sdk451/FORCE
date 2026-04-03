import { fileURLToPath } from "node:url";
import path from "node:path";

/** Directory containing `packs/` (package root), works from dist/*.js */
export function getPackRoot(): string {
  const here = fileURLToPath(new URL(".", import.meta.url));
  return path.resolve(here, "..");
}

export function packsDir(): string {
  return path.join(getPackRoot(), "packs");
}
