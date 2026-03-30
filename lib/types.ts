export type PresetSlug =
  | "nextjs-static"
  | "vite-react"
  | "chrome-extension-mv3"
  | "node-cli-ts"
  | "python-cli";

export type BuilderState = {
  presetSlug: PresetSlug;
  projectName: string;
  projectPurpose: string;
  runtime: string;
  packageManager: string;
  installCommand: string;
  devCommand: string;
  lintCommand: string;
  typecheckCommand: string;
  buildCommand: string;
  testCommand: string;
  repoStructureNotes: string;
  codeStyleRules: string[];
  testingRules: string[];
  securityRules: string[];
  forbiddenActions: string[];
  commitRules: string[];
  branchRules: string[];
  prRules: string[];
  extraNotes: string[];
  lastUpdated: string;
};

export type PresetDefinition = {
  slug: PresetSlug;
  name: string;
  shortLabel: string;
  shortDescription: string;
  runtime: string;
  packageManager: string;
  installCommand: string;
  devCommand: string;
  lintCommand: string;
  typecheckCommand: string;
  buildCommand: string;
  testCommand: string;
  repoStructureNotes: string;
  codeStyleRules: string[];
  testingRules: string[];
  securityRules: string[];
  forbiddenActions: string[];
  commitRules: string[];
  branchRules: string[];
  prRules: string[];
  extraNotes: string[];
};

export type LintSeverity = "error" | "warning" | "tip";

export type LintItem = {
  severity: LintSeverity;
  title: string;
  guidance: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TemplatePageData = {
  slug: PresetSlug;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  whyTailored: string;
};
