#!/usr/bin/env node
/**
 * Claude Code SessionEnd hook — stderr reminder only (no file writes).
 * Emitted to scripts/forge-claude/ by forge-vibe when allow_hooks is enabled.
 */
import fs from "node:fs";
import path from "node:path";

let cwd = process.cwd();
try {
  const raw = fs.readFileSync(0, "utf8");
  if (raw.trim()) {
    const j = JSON.parse(raw);
    if (typeof j.cwd === "string" && j.cwd) cwd = j.cwd;
  }
} catch {
  // stdin empty or not JSON — use cwd
}

const memoryFile = path.join(cwd, "PROJECT_MEMORY.md");
if (fs.existsSync(memoryFile)) {
  console.error(
    "\n[forge-vibe] Session ended — if architecture, constraints, or decisions changed, update PROJECT_MEMORY.md (Decisions vs Scratch).\n",
  );
}

process.exit(0);
