import { confirm, isCancel } from "@clack/prompts";

/**
 * Ask whether to replace on-disk files that differ from the planned install (interactive TTY only).
 * @returns true to overwrite all differing paths; false if user declines or cancels.
 */
export async function promptOverwriteExistingDiffs(opts: {
  diffPaths: string[];
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
}): Promise<boolean> {
  const stdin = opts.stdin ?? process.stdin;
  const stdout = opts.stdout ?? process.stdout;
  if (!stdin.isTTY || !stdout.isTTY) {
    return false;
  }

  const sorted = [...opts.diffPaths].sort();
  const preview = sorted.slice(0, 12);
  const more = sorted.length - preview.length;
  const list = preview.map((p) => `  • ${p}`).join("\n");
  const tail = more > 0 ? `\n  … and ${more} more` : "";

  const result = await confirm({
    message: `${sorted.length} file(s) already exist and differ from this install (for example a previous forge-vibe run or hand edits):\n\n${list}${tail}\n\nOverwrite them with the new installer output?`,
    initialValue: true,
    input: stdin,
    output: stdout,
  });

  if (isCancel(result)) {
    return false;
  }
  return result === true;
}
