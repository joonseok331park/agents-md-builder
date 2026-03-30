import { createStateFromPreset, DEFAULT_PRESET_SLUG, isPresetSlug, STORAGE_KEY } from "./defaults";
import type { BuilderState } from "./types";

type StoredDraft = {
  version: 1;
  state: BuilderState;
};

function readString(
  source: Record<string, unknown>,
  key: keyof BuilderState,
  fallback: string
): string {
  const value = source[key];
  return typeof value === "string" ? value : fallback;
}

function readStringList(
  source: Record<string, unknown>,
  key: keyof BuilderState,
  fallback: string[]
): string[] {
  const value = source[key];
  if (!Array.isArray(value)) {
    return fallback;
  }
  return value.filter((item): item is string => typeof item === "string");
}

function sanitizeDraft(raw: unknown): BuilderState | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const draft = "state" in record ? (record.state as Record<string, unknown>) : record;
  const presetSlug = draft.presetSlug;

  if (typeof presetSlug !== "string" || !isPresetSlug(presetSlug)) {
    return null;
  }

  const fallback = createStateFromPreset(presetSlug);

  return {
    presetSlug,
    projectName: readString(draft, "projectName", fallback.projectName),
    projectPurpose: readString(draft, "projectPurpose", fallback.projectPurpose),
    runtime: readString(draft, "runtime", fallback.runtime),
    packageManager: readString(draft, "packageManager", fallback.packageManager),
    installCommand: readString(draft, "installCommand", fallback.installCommand),
    devCommand: readString(draft, "devCommand", fallback.devCommand),
    lintCommand: readString(draft, "lintCommand", fallback.lintCommand),
    typecheckCommand: readString(draft, "typecheckCommand", fallback.typecheckCommand),
    buildCommand: readString(draft, "buildCommand", fallback.buildCommand),
    testCommand: readString(draft, "testCommand", fallback.testCommand),
    repoStructureNotes: readString(draft, "repoStructureNotes", fallback.repoStructureNotes),
    codeStyleRules: readStringList(draft, "codeStyleRules", fallback.codeStyleRules),
    testingRules: readStringList(draft, "testingRules", fallback.testingRules),
    securityRules: readStringList(draft, "securityRules", fallback.securityRules),
    forbiddenActions: readStringList(draft, "forbiddenActions", fallback.forbiddenActions),
    commitRules: readStringList(draft, "commitRules", fallback.commitRules),
    branchRules: readStringList(draft, "branchRules", fallback.branchRules),
    prRules: readStringList(draft, "prRules", fallback.prRules),
    extraNotes: readStringList(draft, "extraNotes", fallback.extraNotes),
    lastUpdated: readString(draft, "lastUpdated", ""),
  };
}

export function loadDraft(): BuilderState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return sanitizeDraft(JSON.parse(raw));
  } catch {
    return createStateFromPreset(DEFAULT_PRESET_SLUG);
  }
}

export function saveDraft(state: BuilderState): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredDraft = {
    version: 1,
    state,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
