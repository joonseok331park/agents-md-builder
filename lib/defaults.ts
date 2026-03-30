import { presetMap, presets } from "@/content/presets";
import type { BuilderState, PresetSlug } from "./types";

export const SITE_NAME = "AGENTS.md Builder";
export const SITE_URL = "https://agents-md-builder.pages.dev";
export const STORAGE_KEY = "agents-md-builder-draft";
export const DEFAULT_PRESET_SLUG: PresetSlug = "nextjs-static";

export function isPresetSlug(value: string): value is PresetSlug {
  return value in presetMap;
}

export function createStateFromPreset(presetSlug: PresetSlug): BuilderState {
  const preset = presetMap[presetSlug];

  return {
    presetSlug,
    projectName: preset.name,
    projectPurpose: `Generate and maintain a focused ${preset.shortLabel} codebase with explicit agent rules.`,
    runtime: preset.runtime,
    packageManager: preset.packageManager,
    installCommand: preset.installCommand,
    devCommand: preset.devCommand,
    lintCommand: preset.lintCommand,
    typecheckCommand: preset.typecheckCommand,
    buildCommand: preset.buildCommand,
    testCommand: preset.testCommand,
    repoStructureNotes: preset.repoStructureNotes,
    codeStyleRules: [...preset.codeStyleRules],
    testingRules: [...preset.testingRules],
    securityRules: [...preset.securityRules],
    forbiddenActions: [...preset.forbiddenActions],
    commitRules: [...preset.commitRules],
    branchRules: [...preset.branchRules],
    prRules: [...preset.prRules],
    extraNotes: [...preset.extraNotes],
    lastUpdated: "",
  };
}

export function createDefaultState(): BuilderState {
  return createStateFromPreset(DEFAULT_PRESET_SLUG);
}

export function listPresetSlugs(): PresetSlug[] {
  return presets.map((preset) => preset.slug);
}

export function stripStateMetadata(state: BuilderState): Omit<BuilderState, "lastUpdated"> {
  const { lastUpdated, ...rest } = state;
  void lastUpdated;
  return rest;
}
