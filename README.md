# AGENTS.md Builder

AGENTS.md Builder is a static web app for drafting repository instructions without scanning a codebase or sending form contents to a server. It combines stack-specific starting points, a structured form, deterministic Markdown generation, and client-side lint checks.

## Features

- Five presets: Next.js static export, Vite React, Chrome Extension MV3, Node.js CLI, and Python CLI
- Editable setup, architecture, coding, testing, safety, and Git workflow rules
- Live plain-text preview of the generated `AGENTS.md`
- Checks for missing commands, vague wording, duplicate commands, placeholders, and stack mismatches
- Copy and download actions
- Local draft recovery through browser `localStorage`

## How it works

Preset data lives in `content/`. Form state is converted to Markdown by `lib/build-agents-md.ts` and reviewed by deterministic rules in `lib/lint-agents-md.ts`. The browser stores the current draft locally; the app has no backend, account system, repository access, or remote text-generation dependency.

## Project structure

- `app/` contains statically exported routes.
- `components/` contains the builder, preview, lint panel, and export controls.
- `content/` contains presets, examples, FAQs, and template-page copy.
- `lib/` contains generation, linting, storage, routing, and export logic.
- `tests/` covers Markdown generation and lint behavior.

## Local development

Use Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000` after the development server starts.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run build` produces a static export in `out/`.

## Limits

- Presets are starting points, not a substitute for checking the target repository.
- The app does not inspect files, validate that commands exist, or infer project architecture.
- Lint results are heuristics and should be reviewed before exporting.
- Drafts are available only in the browser profile where they were created.
