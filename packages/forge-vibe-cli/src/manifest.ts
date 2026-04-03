import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import type { PackManifest } from "./types.js";
import { packsDir } from "./pack-root.js";

export async function loadPackManifest(): Promise<PackManifest> {
  const p = path.join(packsDir(), "core", "manifest.yaml");
  const raw = await fs.readFile(p, "utf8");
  const doc = YAML.parse(raw) as PackManifest;
  if (!doc?.id || !doc.version || !Array.isArray(doc.directories)) {
    throw new Error(`Invalid pack manifest at ${p}`);
  }
  return doc;
}
