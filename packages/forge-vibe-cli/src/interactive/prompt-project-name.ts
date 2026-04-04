import path from "node:path";
import readline from "node:readline";

/**
 * Basename of the install target directory, for a BMAD-style default project name.
 */
export function suggestedProjectNameFromRoot(projectRoot: string, fallback: string): string {
  const resolved = path.resolve(projectRoot);
  const base = path.basename(resolved).trim();
  if (base === "" || base === "." || base === "..") return fallback;
  return base;
}

/**
 * BMAD-method–style project name prompt (see bmad-code-org/BMAD-METHOD `tools/installer/prompts.js` `text()`):
 * gray ◆ title, gray │ + dim suggested on the next line, then Enter to accept or type to override (BMAD-style).
 * Uses readline only (no raw mode) so it behaves on Windows PowerShell.
 */
export async function promptProjectName(opts: {
  projectRoot: string;
  fallbackHint: string;
  /** Prompt text (BMAD BMM uses “What is your project called?”) */
  message?: string;
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
}): Promise<string> {
  const input = opts.stdin ?? process.stdin;
  const output = opts.stdout ?? process.stdout;
  const suggested = suggestedProjectNameFromRoot(opts.projectRoot, opts.fallbackHint);
  const message = opts.message ?? "What is your project called?";

  if (!output.isTTY || !input.isTTY) {
    const rl = readline.createInterface({ input, output, terminal: true });
    return new Promise((resolve) => {
      rl.question(`${message} [${suggested}]: `, (ans) => {
        rl.close();
        resolve(ans.trim() || suggested);
      });
    });
  }

  const gray = (s: string) => `\u001b[90m${s}\u001b[0m`;
  const dim = (s: string) => `\u001b[2m${s}\u001b[0m`;

  output.write("\n");
  output.write(`${gray("◆")} ${message}\n`);
  output.write(`${gray("│")} ${dim(suggested)}\n`);

  const rl = readline.createInterface({ input, output, terminal: true });
  return new Promise((resolve) => {
    rl.question(`${gray("│")} `, (ans) => {
      rl.close();
      const t = ans.trim();
      resolve(t === "" ? suggested : t);
    });
  });
}
