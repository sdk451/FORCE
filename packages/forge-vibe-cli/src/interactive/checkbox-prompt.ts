import { isCancel, multiselect, select } from "@clack/prompts";

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
  /** Refuse submit until at least one option is selected when > 0 (clack `required`). */
  minSelected?: number;
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
}

/**
 * Interactive multiselect (arrow keys + Space, Enter to confirm) via @clack/prompts,
 * matching BMAD-style installers. Requires a TTY.
 */
export async function promptCheckbox(opts: CheckboxPromptOptions): Promise<Map<string, boolean>> {
  const stdin = opts.stdin ?? process.stdin;
  const stdout = opts.stdout ?? process.stdout;
  const minSel = opts.minSelected ?? 0;

  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error("Checkbox prompt requires an interactive terminal (TTY). Use --answers or --yes.");
  }

  const initialValues = opts.items.filter((i) => i.checked).map((i) => i.id);
  const message =
    opts.subtitle !== undefined && opts.subtitle !== "" ? `${opts.title}\n${opts.subtitle}` : opts.title;

  const result = await multiselect<string>({
    message,
    options: opts.items.map((it) => ({
      value: it.id,
      label: it.label,
      hint: it.hint,
    })),
    initialValues,
    required: minSel > 0,
    input: stdin,
    output: stdout,
  });

  if (isCancel(result)) {
    throw new Error("Cancelled.");
  }

  const selected = new Set(result);
  const out = new Map<string, boolean>();
  for (const it of opts.items) {
    out.set(it.id, selected.has(it.id));
  }
  return out;
}

export type StackId = "typescript" | "python";

/**
 * Choose primary stack for template slices (TypeScript vs Python rules/snippets).
 */
export async function promptStack(opts: {
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
  initial: StackId;
  /** Shown above the options when the repo scan found a likely stack. */
  detectionHint?: string;
}): Promise<StackId> {
  const stdin = opts.stdin ?? process.stdin;
  const stdout = opts.stdout ?? process.stdout;
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error("Stack prompt requires an interactive terminal (TTY). Use --answers or --yes.");
  }

  const lines = [
    "Primary language stack for **AGENTS.md** (stack line) and **forge-stack** rule templates.",
    opts.detectionHint,
  ].filter((x): x is string => Boolean(x && x.trim()));
  const result = await select<StackId>({
    message: lines.join("\n"),
    options: [
      {
        value: "typescript",
        label: "TypeScript / Node",
        hint: "Web, Node, tooling in JS/TS",
      },
      {
        value: "python",
        label: "Python",
        hint: "Scripts, backends, data/ML stacks",
      },
    ],
    initialValue: opts.initial,
    input: stdin,
    output: stdout,
  });

  if (isCancel(result)) {
    throw new Error("Cancelled.");
  }
  return result;
}
