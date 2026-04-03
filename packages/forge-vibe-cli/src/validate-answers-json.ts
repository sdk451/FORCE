import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv } from "ajv";

const schemaDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "schemas");
const schemaPath = path.join(schemaDir, "install-answers.partial.schema.json");

function loadSchema(): object {
  const raw = fs.readFileSync(schemaPath, "utf8");
  return JSON.parse(raw) as object;
}

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(loadSchema());

export function validateInstallAnswersPartialJson(data: unknown): { ok: true } | { ok: false; errors: string } {
  if (validate(data)) return { ok: true };
  return { ok: false, errors: ajv.errorsText(validate.errors, { separator: "\n" }) };
}

export function validateInstallAnswersPartialOrThrow(data: unknown): void {
  const r = validateInstallAnswersPartialJson(data);
  if (!r.ok) throw new Error(`--answers JSON failed schema validation:\n${r.errors}`);
}
