import type { BuilderState, LintItem, LintSeverity } from "./types";

const vaguePattern = /\b(do the right thing|use your best judgment|handle as needed|etc\.?|whatever works)\b/i;
const placeholderPattern = /\b(todo|tbd|replace me|your project|project name|lorem ipsum|\[insert|<project)\b/i;
const severityRank: Record<LintSeverity, number> = {
  error: 0,
  warning: 1,
  tip: 2,
};

function push(items: LintItem[], severity: LintSeverity, title: string, guidance: string): void {
  items.push({ severity, title, guidance });
}

function commandEntries(state: BuilderState): Array<[string, string]> {
  return [
    ["install", state.installCommand.trim()],
    ["dev", state.devCommand.trim()],
    ["lint", state.lintCommand.trim()],
    ["typecheck", state.typecheckCommand.trim()],
    ["build", state.buildCommand.trim()],
    ["test", state.testCommand.trim()],
  ];
}

function activeVerificationCount(state: BuilderState): number {
  return [state.lintCommand, state.typecheckCommand, state.buildCommand, state.testCommand].filter((value) => value.trim())
    .length;
}

function combinedText(state: BuilderState): string[] {
  return [
    state.projectName,
    state.projectPurpose,
    state.runtime,
    state.packageManager,
    state.installCommand,
    state.devCommand,
    state.lintCommand,
    state.typecheckCommand,
    state.buildCommand,
    state.testCommand,
    state.repoStructureNotes,
    ...state.codeStyleRules,
    ...state.testingRules,
    ...state.securityRules,
    ...state.forbiddenActions,
    ...state.commitRules,
    ...state.branchRules,
    ...state.prRules,
    ...state.extraNotes,
  ];
}

export function lintAgentsMd(state: BuilderState, markdown: string): LintItem[] {
  const items: LintItem[] = [];
  const commands = commandEntries(state);
  const commandValues = commands.map(([, value]) => value).filter(Boolean);

  if (!state.projectName.trim()) {
    push(items, "error", "Missing project name", "Add a project name so the generated file is specific to the repository.");
  }

  if (!state.projectPurpose.trim()) {
    push(items, "error", "Missing project purpose", "Write a one-line purpose so agents know the repo's primary job.");
  }

  if (activeVerificationCount(state) === 0) {
    push(
      items,
      "error",
      "Missing verification coverage",
      "Add at least one verification command among lint, typecheck, build, or test."
    );
  }

  if (!state.installCommand.trim()) {
    push(items, "tip", "Install command missing", "Add an install command if contributors need a single reliable setup step.");
  }

  if (!state.devCommand.trim()) {
    push(items, "tip", "Dev command missing", "Add a dev command when the project has an interactive local workflow.");
  }

  if (state.forbiddenActions.every((value) => !value.trim())) {
    push(items, "error", "No forbidden actions", "List at least one thing the agent must never do in this repository.");
  }

  if (state.commitRules.every((value) => !value.trim())) {
    push(items, "warning", "Missing commit policy", "Add commit rules so agents know how and when to create commits.");
  }

  if (state.branchRules.every((value) => !value.trim())) {
    push(items, "warning", "Missing branching policy", "Add branch rules so agents know when to branch and how to scope work.");
  }

  if (!state.repoStructureNotes.trim()) {
    push(
      items,
      "warning",
      "Missing architecture notes",
      "Add repository structure notes so generated instructions mention where routes, logic, and content belong."
    );
  }

  const duplicates = new Set<string>();
  const seenCommands = new Set<string>();
  for (const value of commandValues) {
    const key = value.toLowerCase();
    if (seenCommands.has(key)) {
      duplicates.add(value);
    }
    seenCommands.add(key);
  }
  if (duplicates.size > 0) {
    push(items, "warning", "Duplicate commands", "Use distinct commands or explain why the same command serves multiple roles.");
  }

  for (const value of combinedText(state)) {
    if (vaguePattern.test(value)) {
      push(items, "warning", "Vague instruction detected", "Replace fuzzy phrases with short, imperative rules that an agent can apply consistently.");
      break;
    }
  }

  for (const value of combinedText(state)) {
    if (placeholderPattern.test(value)) {
      push(items, "warning", "Placeholder text detected", "Replace placeholder or TODO-style text before exporting the file.");
      break;
    }
  }

  const headings = Array.from(markdown.matchAll(/^#\s+(.+)$/gm)).map((match) => match[1].trim());
  const headingSet = new Set<string>();
  const duplicateHeadings = new Set<string>();
  for (const heading of headings) {
    const key = heading.toLowerCase();
    if (headingSet.has(key)) {
      duplicateHeadings.add(heading);
    }
    headingSet.add(key);
  }
  if (duplicateHeadings.size > 0) {
    push(items, "warning", "Duplicate headings", "Keep each top-level heading unique so agents can scan the file quickly.");
  }

  if (state.presetSlug === "python-cli") {
    if (commandValues.some((value) => /\bnpm\b|\bpnpm\b|\byarn\b|\bbun\b/i.test(value))) {
      push(items, "error", "Stack-inconsistent commands", "Replace Node-oriented commands with Python or uv-based commands for the Python preset.");
    }
  } else if (!commandValues.some((value) => /\bnpm\b|\bpnpm\b|\byarn\b|\bbun\b/i.test(value))) {
    push(items, "warning", "Stack-inconsistent commands", "Node-oriented presets should usually reference npm, pnpm, yarn, or bun commands.");
  }

  if (state.repoStructureNotes.trim().length > 320 || combinedText(state).some((value) => value.trim().length > 180)) {
    push(items, "tip", "A section is getting long", "Shorten long notes so the generated AGENTS.md stays fast to scan.");
  }

  return items.sort((left, right) => severityRank[left.severity] - severityRank[right.severity]);
}
