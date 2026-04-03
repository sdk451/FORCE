/** Wrap Markdown body in Cursor `.mdc` frontmatter (canonical research §1.1 / §1.3). */
export function wrapCursorMdc(opts: {
  description: string;
  globs: string;
  alwaysApply: boolean;
  body: string;
}): string {
  return `---
description: ${opts.description}
globs: "${opts.globs}"
alwaysApply: ${opts.alwaysApply}
---

${opts.body.trim()}
`;
}
