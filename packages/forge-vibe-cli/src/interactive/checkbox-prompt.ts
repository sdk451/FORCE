import readline from "node:readline";

export interface CheckboxItem {
  id: string;
  label: string;
  /** Shown after label */
  hint?: string;
  checked: boolean;
}

export interface CheckboxPromptOptions {
  title: string;
  subtitle?: string;
  items: CheckboxItem[];
  /** Refuse finish until at least this many items are checked (default 0). */
  minSelected?: number;
  /** Error line when user tries to finish below minSelected */
  minSelectedMessage?: string;
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
}

/**
 * BMAD-style multiselect: numbered list, plain line input (works on Windows PowerShell).
 * Enter numbers separated by spaces or commas to toggle those rows; empty line finishes
 * when minSelected is satisfied. No raw mode / arrow keys (avoids readline+TTY issues on Windows).
 */
export function promptCheckbox(opts: CheckboxPromptOptions): Promise<Map<string, boolean>> {
  const stdin = opts.stdin ?? process.stdin;
  const stdout = opts.stdout ?? process.stdout;
  const minSel = opts.minSelected ?? 0;
  const minMsg =
    opts.minSelectedMessage ?? `Keep at least ${minSel} option(s) selected. Enter numbers to toggle, then empty line to confirm.`;

  if (!stdin.isTTY) {
    return Promise.reject(
      new Error("Checkbox prompt requires an interactive terminal (TTY). Use --answers or --yes."),
    );
  }

  const state = opts.items.map((i) => ({ ...i }));

  const selectedCount = (): number => state.filter((s) => s.checked).length;

  const formatList = (): string => {
    const lines: string[] = [];
    lines.push("");
    lines.push(opts.title);
    if (opts.subtitle) lines.push(opts.subtitle);
    lines.push("");
    for (let i = 0; i < state.length; i++) {
      const it = state[i]!;
      const box = it.checked ? "[x]" : "[ ]";
      const hintPart = it.hint ? ` (${it.hint})` : "";
      lines.push(`  ${i + 1}. ${box}  ${it.label}${hintPart}`);
    }
    lines.push("");
    lines.push("Enter line number(s) to toggle (e.g. 3 or 2,4 or 1 5). Empty line = done.");
    lines.push(`(Need at least ${minSel} selected. Type q + Enter to cancel.)`);
    lines.push("");
    return lines.join("\n");
  };

  const rl = readline.createInterface({ input: stdin, output: stdout, terminal: true });

  return new Promise((resolve, reject) => {
    const finish = (): void => {
      rl.close();
      const out = new Map<string, boolean>();
      for (const it of state) out.set(it.id, it.checked);
      resolve(out);
    };

    const fail = (e: Error): void => {
      rl.close();
      reject(e);
    };

    const ask = (): void => {
      stdout.write(formatList());
      rl.question("> ", (line) => {
        const trimmed = line.trim().toLowerCase();
        if (trimmed === "q" || trimmed === "quit") {
          fail(new Error("Cancelled."));
          return;
        }
        if (trimmed === "") {
          if (selectedCount() < minSel) {
            stdout.write(`\n${minMsg}\n`);
            ask();
            return;
          }
          finish();
          return;
        }
        const nums = trimmed
          .split(/[\s,]+/)
          .map((p) => parseInt(p, 10))
          .filter((n) => Number.isInteger(n) && n >= 1 && n <= state.length);
        for (const n of nums) {
          const it = state[n - 1]!;
          it.checked = !it.checked;
        }
        ask();
      });
    };

    ask();
  });
}

export function promptLine(question: string, stdin?: NodeJS.ReadStream, stdout?: NodeJS.WriteStream): Promise<string> {
  const input = stdin ?? process.stdin;
  const output = stdout ?? process.stdout;
  const rl = readline.createInterface({ input, output, terminal: true });
  return new Promise((resolve) => {
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}
