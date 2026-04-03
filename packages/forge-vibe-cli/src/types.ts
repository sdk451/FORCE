export type StackId = "typescript" | "python";

export interface InstallAnswers {
  project_name: string;
  stack: StackId;
  targets: {
    claude_code: boolean;
    cursor: boolean;
  };
  include_ui_workflow_pack: boolean;
  include_memory_enhanced: boolean;
  allow_hooks: boolean;
}

export const defaultAnswers: InstallAnswers = {
  project_name: "my-project",
  stack: "typescript",
  targets: { claude_code: true, cursor: true },
  include_ui_workflow_pack: false,
  include_memory_enhanced: true,
  allow_hooks: false,
};

export interface PackManifest {
  id: string;
  version: string;
  description?: string;
  canonical_slices: string[];
  optional_packs: { id: string; description?: string }[];
  reserved_pack_ids?: string[];
  directories: string[];
}

export interface ResolvedPlan {
  manifest: PackManifest;
  answers: InstallAnswers;
  files: PlannedFile[];
}

export interface PlannedFile {
  path: string;
  content: string;
  /** high | medium for hook-related */
  riskTier?: "high" | "medium" | "low";
}
