import type { BuilderState } from "./types";

function uniqueItems(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) {
      continue;
    }
    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(normalized);
  }

  return result;
}

function bulletLines(values: string[]): string[] {
  return uniqueItems(values).map((value) => `- ${value}`);
}

function addSection(lines: string[], heading: string, body: string[]): void {
  if (body.length === 0) {
    return;
  }

  if (lines.length > 0) {
    lines.push("");
  }

  lines.push(heading, ...body);
}

export function buildAgentsMd(state: BuilderState): string {
  const lines: string[] = [];

  addSection(lines, "# Project Purpose", [
    state.projectName.trim() ? `- Project name: ${state.projectName.trim()}` : "",
    state.projectPurpose.trim() ? `- Purpose: ${state.projectPurpose.trim()}` : "",
    `- Primary runtime: ${state.runtime.trim()}`,
    `- Package manager: ${state.packageManager.trim()}`,
  ].filter(Boolean));

  addSection(lines, "# Hard Constraints", bulletLines(state.forbiddenActions));

  const commandLines = [
    state.installCommand.trim() ? `- Install: \`${state.installCommand.trim()}\`` : "",
    state.devCommand.trim() ? `- Dev: \`${state.devCommand.trim()}\`` : "",
    state.lintCommand.trim() ? `- Lint: \`${state.lintCommand.trim()}\`` : "",
    state.typecheckCommand.trim() ? `- Typecheck: \`${state.typecheckCommand.trim()}\`` : "",
    state.buildCommand.trim() ? `- Build: \`${state.buildCommand.trim()}\`` : "",
    state.testCommand.trim() ? `- Test: \`${state.testCommand.trim()}\`` : "",
  ].filter(Boolean);

  const testingLines = bulletLines(state.testingRules);
  const setupLines = [...commandLines];
  if (testingLines.length > 0) {
    setupLines.push("", "## Testing Instructions", ...testingLines);
  }
  addSection(lines, "# Setup and Verification Commands", setupLines);

  addSection(lines, "# Code Conventions", bulletLines(state.codeStyleRules));

  addSection(lines, "# Safety Rules", bulletLines(state.securityRules));

  const gitLines: string[] = [];
  const commitLines = bulletLines(state.commitRules);
  const branchLines = bulletLines(state.branchRules);
  const prLines = bulletLines(state.prRules);

  if (commitLines.length > 0) {
    gitLines.push("## Commit Rules", ...commitLines);
  }
  if (branchLines.length > 0) {
    if (gitLines.length > 0) {
      gitLines.push("");
    }
    gitLines.push("## Branch Rules", ...branchLines);
  }
  if (prLines.length > 0) {
    if (gitLines.length > 0) {
      gitLines.push("");
    }
    gitLines.push("## Pull Request Rules", ...prLines);
  }
  addSection(lines, "# Git Workflow Rules", gitLines);

  addSection(lines, "# Directory or Architecture Notes", bulletLines([state.repoStructureNotes]));

  const extraNotes = bulletLines(state.extraNotes);
  if (extraNotes.length > 0) {
    addSection(lines, "# Project-Specific Notes", extraNotes);
  }

  return `${lines.join("\n").trim()}\n`;
}
