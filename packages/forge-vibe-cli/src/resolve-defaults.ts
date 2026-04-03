import type { InstallAnswers } from "./types.js";
import { defaultAnswers } from "./types.js";

export function resolveDefaults(partial: Partial<InstallAnswers>): InstallAnswers {
  return {
    project_name: partial.project_name ?? defaultAnswers.project_name,
    stack: partial.stack ?? defaultAnswers.stack,
    targets: {
      claude_code: partial.targets?.claude_code ?? defaultAnswers.targets.claude_code,
      cursor: partial.targets?.cursor ?? defaultAnswers.targets.cursor,
    },
    include_ui_workflow_pack:
      partial.include_ui_workflow_pack ?? defaultAnswers.include_ui_workflow_pack,
    include_memory_enhanced:
      partial.include_memory_enhanced ?? defaultAnswers.include_memory_enhanced,
    allow_hooks: partial.allow_hooks ?? defaultAnswers.allow_hooks,
  };
}
