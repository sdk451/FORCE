/** Directory name under each host skills tree (e.g. `.cursor/skills/forge-tdd/`). */
export function forgeSkillInstallDir(skillId: string): string {
  return `forge-${skillId}`;
}
