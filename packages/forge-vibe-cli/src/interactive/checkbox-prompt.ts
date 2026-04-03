import readline from "node:readline";

export interface CheckboxItem {
  id: string;
  label: string;
  /** Shown dimmed after label */
  hint?: string;
  checked: boolean;
}

export interface CheckboxPromptOptions {
  title: string;
  subtitle?: string;
  items: CheckboxItem[];
  /** Refuse Enter until at least this many items are checked (default 0). */
  minSelected?: number;
  /** Error line when Enter pressed below minSelected */
  minSelectedMessage?: string;
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
}

function dim(s: string, stdout: NodeJS.WriteStream): string {
  if (!stdout.isTTY) return s;
  return `\u001b[2m${s}\u001b[0m`;
}

function focusPrefix(focused: boolean, stdout: NodeJS.WriteStream): string {
  if (!stdout.isTTY) return "  ";
  return focused ? "\u001b[1m›\u001b[0m " : "  ";
}

/**
 * BMAD-style terminal multiselect: `[ ]` / `[x]`, Space toggles, Enter confirms,
 * ↑/↓ (or j/k) moves. Requires a TTY stdin.
 */
export function promptCheckbox(opts: CheckboxPromptOptions): Promise<Map<string, boolean>> {
  const stdin = opts.stdin ?? process.stdin;
  const stdout = opts.stdout ?? process.stdout;
  const minSel = opts.minSelected ?? 0;
  const minMsg =
    opts.minSelectedMessage ?? `Select at least ${minSel} option(s). (Space toggles, Enter confirms.)`;

  const state = opts.items.map((i) => ({ ...i }));
  let focus = 0;
  let errFlash = "";
  let lineCount = 0;

  if (!stdin.isTTY) {
    return Promise.reject(
      new Error("Checkbox prompt requires an interactive terminal (TTY). Use --answers or --yes."),
    );
  }

  const render = (): void => {
    const lines: string[] = [];
    lines.push("");
    lines.push(opts.title);
    if (opts.subtitle) lines.push(dim(opts.subtitle, stdout));
    lines.push("");
    for (let i = 0; i < state.length; i++) {
      const it = state[i]!;
      const box = it.checked ? "[x]" : "[ ]";
      const hintPart = it.hint ? ` ${dim(`(${it.hint})`, stdout)}` : "";
      const rowText = `${focusPrefix(i === focus, stdout)}${box}  ${it.label}${hintPart}`;
      lines.push(rowText);
    }
    lines.push("");
    lines.push(dim("Space toggle · Enter confirm · ↑/↓ or j/k move · Ctrl+C exit", stdout));
    // Fixed-height footer so cursor rewind stays stable when error text toggles.
    lines.push(errFlash ? dim(errFlash, stdout) : dim(" ", stdout));

    if (lineCount > 0) {
      stdout.write(`\u001b[${lineCount}A`);
    }
    for (const ln of lines) {
      stdout.write("\u001b[2K\r" + ln + "\n");
    }
    lineCount = lines.length;
  };

  readline.emitKeypressEvents(stdin);
  if (stdin.isTTY) stdin.setRawMode(true);

  return new Promise((resolve, reject) => {
    const cleanup = (): void => {
      if (stdin.isTTY) stdin.setRawMode(false);
      stdin.removeListener("keypress", onKey);
    };

    const finish = (): void => {
      cleanup();
      const out = new Map<string, boolean>();
      for (const it of state) out.set(it.id, it.checked);
      stdout.write("\n");
      resolve(out);
    };

    const fail = (e: Error): void => {
      cleanup();
      reject(e);
    };

    const selectedCount = (): number => state.filter((s) => s.checked).length;

    const onKey = (_str: string | undefined, key: readline.Key): void => {
      if (key.ctrl && key.name === "c") {
        fail(new Error("Cancelled (Ctrl+C)"));
        return;
      }
      errFlash = "";

      if (key.name === "up" || key.name === "k") {
        focus = (focus - 1 + state.length) % state.length;
        render();
        return;
      }
      if (key.name === "down" || key.name === "j") {
        focus = (focus + 1) % state.length;
        render();
        return;
      }
      if (key.name === "space") {
        state[focus]!.checked = !state[focus]!.checked;
        render();
        return;
      }
      if (key.name === "return" || key.name === "enter") {
        if (selectedCount() < minSel) {
          errFlash = minMsg;
          render();
          return;
        }
        finish();
        return;
      }
    };

    stdin.on("keypress", onKey);
    render();
  });
}

export function promptLine(question: string, stdin?: NodeJS.ReadStream, stdout?: NodeJS.WriteStream): Promise<string> {
  const input = stdin ?? process.stdin;
  const output = stdout ?? process.stdout;
  const rl = readline.createInterface({ input, output });
  return new Promise((resolve) => {
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}
