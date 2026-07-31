import type { PresetDefinition, PresetSlug } from "@/lib/types";

export const presets: PresetDefinition[] = [
  {
    slug: "nextjs-static",
    name: "Next.js Static Export",
    shortLabel: "Next.js Static",
    shortDescription: "For App Router projects that must build to deployable static files.",
    runtime: "TypeScript + Next.js App Router",
    packageManager: "npm",
    installCommand: "npm ci",
    devCommand: "npm run dev",
    lintCommand: "npm run lint",
    typecheckCommand: "npm run typecheck",
    buildCommand: "npm run build",
    testCommand: "npm run test",
    repoStructureNotes:
      "Keep routes in /app, shared UI in /components, static content in dedicated data modules, and reusable browser-safe logic in /lib. Preserve static rendering across every public route.",
    codeStyleRules: [
      "Use strict TypeScript and explicit types at module boundaries.",
      "Keep client components limited to interactions that need browser APIs or state.",
      "Prefer small components and straightforward data flow over unnecessary abstraction.",
    ],
    testingRules: [
      "Add focused unit tests for reusable logic and regression-prone transformations.",
      "Build the static export after route, metadata, or rendering changes.",
    ],
    securityRules: [
      "Keep secrets out of client bundles and committed environment files.",
      "Treat browser storage and URL parameters as untrusted input.",
    ],
    forbiddenActions: [
      "Do not add API routes, server actions, middleware, or runtime-only rendering.",
      "Do not introduce runtime fetches that are required for the static site to work.",
      "Do not disable static export to accommodate a feature.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Commit only after lint, typecheck, tests, and the production build pass.",
    ],
    branchRules: [
      "Use a focused feature or fix branch for non-trivial behavior changes.",
      "Keep each branch scoped to one logical change.",
    ],
    prRules: [
      "Summarize user-visible behavior and list the verification commands that ran.",
      "Call out route, metadata, or static-export changes explicitly.",
    ],
    extraNotes: ["Verify the generated `out/` directory before changing deployment configuration."],
  },
  {
    slug: "vite-react",
    name: "Vite React App",
    shortLabel: "Vite React",
    shortDescription: "For client-side React applications built with Vite.",
    runtime: "TypeScript + React + Vite",
    packageManager: "npm",
    installCommand: "npm ci",
    devCommand: "npm run dev",
    lintCommand: "npm run lint",
    typecheckCommand: "npm run typecheck",
    buildCommand: "npm run build",
    testCommand: "npm run test",
    repoStructureNotes:
      "Keep application entry wiring in /src, group feature components by domain, keep shared UI easy to discover, and isolate pure utilities from browser-coupled hooks.",
    codeStyleRules: [
      "Use strict TypeScript and explicit props for exported components.",
      "Keep effects narrow and derive values instead of duplicating state.",
      "Prefer accessible native controls before custom interaction patterns.",
    ],
    testingRules: [
      "Test pure logic independently from component rendering.",
      "Cover important user interactions and error states with focused tests.",
    ],
    securityRules: [
      "Do not place secrets in Vite client environment variables.",
      "Validate persisted or URL-derived state before using it.",
    ],
    forbiddenActions: [
      "Do not add hidden telemetry or network requests.",
      "Do not add a global state or form library without a demonstrated need.",
      "Do not expose credentials or privileged service tokens to the browser.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Keep commits scoped to one feature, fix, or refactor.",
    ],
    branchRules: [
      "Use `feature/` or `fix/` branches for behavior changes.",
      "Avoid mixing unrelated interface and data-flow changes in one branch.",
    ],
    prRules: [
      "Describe the affected user flow and list automated checks.",
      "List the responsive and keyboard interactions exercised for UI changes.",
    ],
    extraNotes: ["Document any new public environment variable and its safe client-side purpose."],
  },
  {
    slug: "chrome-extension-mv3",
    name: "Chrome Extension MV3",
    shortLabel: "Chrome Extension",
    shortDescription: "For Manifest V3 extensions with explicit permissions and execution boundaries.",
    runtime: "TypeScript + Chrome Extension Manifest V3",
    packageManager: "npm",
    installCommand: "npm ci",
    devCommand: "npm run dev",
    lintCommand: "npm run lint",
    typecheckCommand: "npm run typecheck",
    buildCommand: "npm run build",
    testCommand: "npm run test",
    repoStructureNotes:
      "Separate popup, options, service-worker, and content-script code. Keep message contracts typed, isolate browser API wrappers, and make manifest permissions easy to audit.",
    codeStyleRules: [
      "Document which extension context owns each entrypoint.",
      "Keep cross-context messages typed and validated.",
      "Avoid shared mutable globals across extension surfaces.",
    ],
    testingRules: [
      "Cover message validation and permission-sensitive helpers with unit tests.",
      "Load the unpacked extension and exercise each affected surface after a production build.",
    ],
    securityRules: [
      "Keep host and optional permissions as narrow as possible.",
      "Treat page content and cross-context messages as untrusted input.",
    ],
    forbiddenActions: [
      "Do not load remote executable code or use eval-like behavior.",
      "Do not broaden host permissions without a documented feature requirement.",
      "Do not hide manifest or permission changes inside unrelated work.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Describe manifest or permission changes in the commit body.",
    ],
    branchRules: [
      "Use focused branches for popup, content-script, service-worker, or manifest changes.",
      "Keep permission changes separate from unrelated visual work.",
    ],
    prRules: [
      "Highlight manifest and permission changes near the top of the summary.",
      "List the extension surfaces tested manually.",
    ],
    extraNotes: ["Review Chrome Web Store policy implications when permissions or remote communication change."],
  },
  {
    slug: "node-cli-ts",
    name: "Node CLI in TypeScript",
    shortLabel: "Node CLI",
    shortDescription: "For TypeScript command-line tools with explicit I/O and failure behavior.",
    runtime: "TypeScript + Node.js CLI",
    packageManager: "npm",
    installCommand: "npm ci",
    devCommand: "npm run dev",
    lintCommand: "npm run lint",
    typecheckCommand: "npm run typecheck",
    buildCommand: "npm run build",
    testCommand: "npm run test",
    repoStructureNotes:
      "Keep command entrypoints thin, validate arguments at the boundary, and move domain logic into testable modules. Keep filesystem and process side effects explicit.",
    codeStyleRules: [
      "Return structured results from reusable logic instead of printing deep inside helpers.",
      "Write normal output to stdout and actionable diagnostics to stderr.",
      "Use non-zero exit codes for failed commands.",
    ],
    testingRules: [
      "Test argument validation, exit behavior, and output formatting.",
      "Use temporary directories for filesystem tests and keep fixtures small.",
    ],
    securityRules: [
      "Validate untrusted paths, arguments, and subprocess input.",
      "Avoid shell interpolation when a direct process argument array is available.",
    ],
    forbiddenActions: [
      "Do not add background services or daemons.",
      "Do not make network access a hidden requirement for core commands.",
      "Do not perform destructive file operations without explicit validation.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Keep commits focused on one command or output behavior.",
    ],
    branchRules: [
      "Use `feature/` or `fix/` branches for command behavior changes.",
      "Do not batch unrelated commands into one branch.",
    ],
    prRules: [
      "List affected commands, exit-code changes, and exact verification commands.",
      "Call out filesystem, process, or output-format changes.",
    ],
    extraNotes: ["Keep help text and documented examples synchronized with command behavior."],
  },
  {
    slug: "python-cli",
    name: "Python CLI",
    shortLabel: "Python CLI",
    shortDescription: "For typed Python command-line tools managed with uv.",
    runtime: "Python CLI",
    packageManager: "uv",
    installCommand: "uv sync",
    devCommand: "",
    lintCommand: "uv run ruff check .",
    typecheckCommand: "uv run pyright",
    buildCommand: "uv build",
    testCommand: "uv run pytest",
    repoStructureNotes:
      "Keep package code under one import root, keep the CLI entrypoint thin, validate inputs at the boundary, and move domain logic into typed, testable modules.",
    codeStyleRules: [
      "Use type hints and explicit return values for public functions.",
      "Keep argument parsing close to the entrypoint and business logic in modules.",
      "Avoid hidden global state and environment-dependent defaults.",
    ],
    testingRules: [
      "Use pytest for command, validation, and domain-logic regression tests.",
      "Use temporary paths for filesystem behavior and keep fixtures deterministic.",
    ],
    securityRules: [
      "Validate filesystem paths and subprocess arguments before use.",
      "Keep credentials out of source files, fixtures, and command output.",
    ],
    forbiddenActions: [
      "Do not add hidden network access to core commands.",
      "Do not invoke shell commands with unvalidated user input.",
      "Do not perform destructive file operations without an explicit confirmation or dry-run path.",
    ],
    commitRules: [
      "Use Conventional Commits.",
      "Keep packaging and environment changes separate from feature work.",
    ],
    branchRules: [
      "Use a focused feature or fix branch for behavior changes.",
      "Do not combine CLI behavior changes with unrelated packaging work.",
    ],
    prRules: [
      "List the `uv` commands used for verification.",
      "Call out entrypoint, packaging, exit-code, or filesystem changes.",
    ],
    extraNotes: ["Add the project-specific development command before exporting the final file."],
  },
];

export const presetMap = Object.fromEntries(presets.map((preset) => [preset.slug, preset])) as Record<
  PresetSlug,
  PresetDefinition
>;
