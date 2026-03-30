import type { PresetDefinition, PresetSlug } from "@/lib/types";

export const presets: PresetDefinition[] = [
  {
    slug: "nextjs-static",
    name: "Next.js Static Export",
    shortLabel: "Next.js Static",
    shortDescription: "For static App Router projects that must stay export-safe and SEO-friendly.",
    runtime: "TypeScript + Next.js App Router",
    packageManager: "npm",
    installCommand: "npm install",
    devCommand: "npm run dev",
    lintCommand: "npm run lint",
    typecheckCommand: "npm run typecheck",
    buildCommand: "npm run build",
    testCommand: "npm run test",
    repoStructureNotes:
      "Keep routes in /app, reusable UI in /components, static preset and template copy in /content, and pure generation or linting helpers in /lib. Preserve static export compatibility across every route.",
    codeStyleRules: [
      "Use TypeScript strict mode and explicit exported types.",
      "Keep generation and lint logic deterministic and side-effect free.",
      "Prefer small components and plain CSS over framework-heavy abstractions.",
    ],
    testingRules: [
      "Cover markdown section order and omission behavior with Vitest.",
      "Cover lint heuristics for missing rules, duplicate commands, and placeholder text.",
    ],
    securityRules: [
      "Keep all draft data in browser memory and localStorage only.",
      "Do not add runtime remote fetches, cookies, auth, or analytics SDKs.",
    ],
    forbiddenActions: [
      "Do not add API routes, server actions, or middleware.",
      "Do not add remote AI calls or repository scanning.",
      "Do not weaken static export to support convenience features.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Commit only after lint, typecheck, test, and build pass.",
    ],
    branchRules: [
      "Create a feature or fix branch for non-trivial work off the default branch.",
      "Keep each branch scoped to one logical unit.",
    ],
    prRules: [
      "Summarize the changed preset or route behavior and list validation commands.",
      "Call out SEO, localStorage, or static-export impacts explicitly.",
    ],
    extraNotes: ["Prefer query-param preset entry points such as `/?preset=nextjs-static` for landing-page CTAs."],
  },
  {
    slug: "vite-react",
    name: "Vite React App",
    shortLabel: "Vite React",
    shortDescription: "For client-heavy React apps that still need crisp agent rules and predictable commands.",
    runtime: "TypeScript + React + Vite",
    packageManager: "npm",
    installCommand: "npm install",
    devCommand: "npm run dev",
    lintCommand: "npm run lint",
    typecheckCommand: "npm run typecheck",
    buildCommand: "npm run build",
    testCommand: "npm run test",
    repoStructureNotes:
      "Keep entry wiring near /src/main, colocate feature UI by domain, keep shared components obvious, and isolate pure utilities from browser-coupled hooks.",
    codeStyleRules: [
      "Use strict TypeScript and explicit props for exported components.",
      "Keep browser-only state in client hooks and pure text generation in utilities.",
      "Avoid over-abstracting small UI flows.",
    ],
    testingRules: [
      "Test deterministic builders and linters separately from UI shells.",
      "Prefer small fixture-driven tests over snapshot-heavy suites.",
    ],
    securityRules: [
      "Keep user-entered content in browser storage only.",
      "Do not add telemetry, tracking pixels, or runtime data sync.",
    ],
    forbiddenActions: [
      "Do not add backend proxy endpoints or hosted prompt services.",
      "Do not add global state libraries without approval.",
      "Do not add form frameworks for simple structured inputs.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Keep commits scoped to one feature or bug fix.",
    ],
    branchRules: [
      "Use `feature/` or `fix/` branches for behavior changes.",
      "Avoid mixing unrelated UI and logic changes in one branch.",
    ],
    prRules: [
      "Explain why the preset or lint guidance changed.",
      "List manual UI paths exercised when visual behavior changes.",
    ],
    extraNotes: ["Prefer plain inputs and repeatable rows instead of drag-and-drop builders."],
  },
  {
    slug: "chrome-extension-mv3",
    name: "Chrome Extension MV3",
    shortLabel: "Chrome Extension",
    shortDescription: "For Manifest V3 browser extensions with stricter packaging and permission boundaries.",
    runtime: "TypeScript + Chrome Extension Manifest V3",
    packageManager: "npm",
    installCommand: "npm install",
    devCommand: "npm run dev",
    lintCommand: "npm run lint",
    typecheckCommand: "npm run typecheck",
    buildCommand: "npm run build:extension",
    testCommand: "npm run test",
    repoStructureNotes:
      "Separate extension surfaces clearly: popup, options, background, and content scripts should not share accidental globals. Keep manifest generation and permission declarations easy to audit.",
    codeStyleRules: [
      "Keep extension permissions minimal and explicit.",
      "Isolate browser API wrappers from view components.",
      "Document which scripts run in which extension context.",
    ],
    testingRules: [
      "Cover manifest-sensitive builders or guards with unit tests.",
      "Verify permission-related lint rules whenever commands or surfaces change.",
    ],
    securityRules: [
      "Do not inject remote scripts or remote config fetches.",
      "Keep extension permissions and storage usage minimal.",
    ],
    forbiddenActions: [
      "Do not add remote code loading or eval-like behavior.",
      "Do not request host permissions broader than the feature needs.",
      "Do not hide permission changes in unrelated commits.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Call out manifest or permission changes in the commit body when relevant.",
    ],
    branchRules: [
      "Use isolated branches for popup, content script, or manifest changes.",
      "Avoid bundling permission changes with unrelated UX polish.",
    ],
    prRules: [
      "Highlight manifest or permission changes near the top of the summary.",
      "List the extension surfaces manually exercised.",
    ],
    extraNotes: ["Keep generated AGENTS rules explicit about popup, background, and content-script boundaries."],
  },
  {
    slug: "node-cli-ts",
    name: "Node CLI in TypeScript",
    shortLabel: "Node CLI",
    shortDescription: "For repository-local command-line tools that need deterministic behavior and clear verification.",
    runtime: "TypeScript + Node.js CLI",
    packageManager: "npm",
    installCommand: "npm install",
    devCommand: "npm run dev",
    lintCommand: "npm run lint",
    typecheckCommand: "npm run typecheck",
    buildCommand: "npm run build",
    testCommand: "npm run test",
    repoStructureNotes:
      "Keep command entrypoints small, put argument parsing and validation near the CLI boundary, and keep text formatting or filesystem logic in pure utilities when possible.",
    codeStyleRules: [
      "Keep CLI side effects explicit and easy to trace.",
      "Return structured results from pure helpers instead of printing deep inside them.",
      "Prefer small command modules over large switch-heavy entrypoints.",
    ],
    testingRules: [
      "Test builders and linters as pure functions.",
      "Add fixture-sized tests for command parsing or output formatting when behavior changes.",
    ],
    securityRules: [
      "Do not shell out to untrusted input without validation.",
      "Avoid hidden network calls or telemetry in CLI flows.",
    ],
    forbiddenActions: [
      "Do not add background services or daemons.",
      "Do not add remote dependency on hosted APIs for core behavior.",
      "Do not bypass validation for file writes or destructive commands.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Keep commits focused on one command or output behavior at a time.",
    ],
    branchRules: [
      "Use `feature/` or `fix/` branches for CLI behavior changes.",
      "Do not batch unrelated command changes together.",
    ],
    prRules: [
      "List affected CLI commands and exact verification commands.",
      "Call out any filesystem or output format changes.",
    ],
    extraNotes: ["Use concise imperative guidance because CLI repos benefit from highly scannable AGENTS files."],
  },
  {
    slug: "python-cli",
    name: "Python CLI",
    shortLabel: "Python CLI",
    shortDescription: "For Python command-line tools that should stay clean, testable, and dependency-light.",
    runtime: "Python CLI",
    packageManager: "uv",
    installCommand: "uv sync",
    devCommand: "uv run python -m your_package",
    lintCommand: "uv run ruff check .",
    typecheckCommand: "uv run pyright",
    buildCommand: "uv run python -m build",
    testCommand: "uv run pytest",
    repoStructureNotes:
      "Keep package code under a single import root, keep CLI entrypoints thin, and keep formatting or parsing helpers pure enough for fast unit tests.",
    codeStyleRules: [
      "Prefer typed functions and explicit return values.",
      "Keep CLI parsing close to the entrypoint and move business logic into modules.",
      "Avoid hidden globals and environment-dependent defaults.",
    ],
    testingRules: [
      "Use pytest for builder and linter regression cases.",
      "Keep fixtures small and deterministic.",
    ],
    securityRules: [
      "Do not send user content to remote APIs.",
      "Validate filesystem and subprocess inputs before use.",
    ],
    forbiddenActions: [
      "Do not add web backends, auth, or hosted sync features.",
      "Do not add hidden network access for core flows.",
      "Do not replace deterministic builders with AI generation.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Keep Python environment or packaging changes isolated from feature work.",
    ],
    branchRules: [
      "Use focused feature or fix branches.",
      "Do not combine CLI UX changes with packaging overhauls in one branch.",
    ],
    prRules: [
      "List `uv` commands used for validation.",
      "Call out packaging or entrypoint changes clearly.",
    ],
    extraNotes: ["Replace placeholder module names like `your_package` before exporting the final file."],
  },
];

export const presetMap = Object.fromEntries(presets.map((preset) => [preset.slug, preset])) as Record<
  PresetSlug,
  PresetDefinition
>;
