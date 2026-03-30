# specification.md

## Project Overview
- Product name: AGENTS.md Builder
- Goal: let a developer generate a high-quality `AGENTS.md` file in under 3 minutes without AI, backend, repo scanning, or external services.
- Positioning: single-purpose static utility, not a documentation platform and not a general prompt builder.
- Audience: global solo developers and indie hackers using AI coding agents.
- Language strategy: English-first UI, SEO copy, metadata, and examples.
- Deployment model: static export to Cloudflare Pages.
- Revenue posture: the information architecture should remain compatible with future low-touch sponsor or ad placement, but ad integration is not part of MVP.
- Success criteria for v1:
  - user can select a preset
  - fill a structured form
  - see a live preview
  - resolve lint warnings
  - copy or download `AGENTS.md`
  - refresh or revisit and recover the same draft from the same browser

## Tech Stack
- Framework: Next.js App Router with `output: 'export'`
- Language: TypeScript with strict mode
- Styling: plain CSS in `app/globals.css`
- Interactivity: React client components only where browser APIs are needed
- Persistence: `localStorage` only
- Content source: local TypeScript data files in `/content`
- Deployment target: Cloudflare Pages
- Validation: ESLint + TypeScript typecheck + Vitest + production build
- Absolute bans:
  - no API routes
  - no server actions
  - no database
  - no auth
  - no cookies
  - no remote runtime fetches
  - no external AI API
  - no paid services

## Routes
- `/` main generator page
- `/guide` what AGENTS.md is, why it exists, and how to write it well
- `/examples` copyable preset examples
- `/templates/[slug]` preset-specific static landing pages for SEO
- `/robots.txt` generated from `app/robots.ts`
- `/sitemap.xml` generated from `app/sitemap.ts`

## Presets
Initial preset list:
1. `nextjs-static`
2. `vite-react`
3. `chrome-extension-mv3`
4. `node-cli-ts`
5. `python-cli`

Each preset must define:
- default project overview text
- common install/dev/lint/typecheck/build/test commands
- typical directory assumptions
- default forbidden actions
- default commit and branching rules
- stack-specific reminders

## Core Features

### 1. Preset picker
- Show the 5 presets as clear selectable cards or segmented buttons.
- Selecting a preset fills sensible defaults into the form.
- Preset pages at `/templates/[slug]` must link back to `/?preset=<slug>`.
- If the user already changed the current draft, switching presets must warn before destructive reset.

### 2. Structured builder form
Collect these inputs:
- project name
- one-line project purpose
- selected preset
- primary language or runtime
- package manager
- install command
- dev command
- lint command
- typecheck command
- build command
- test command
- repository structure notes
- code style rules
- testing instructions
- security rules
- forbidden actions
- commit rules
- branch rules
- pull request rules
- extra project notes

Form rules:
- Required:
  - project name
  - project purpose
  - preset
  - at least one verification command among lint, typecheck, build, or test
  - at least one forbidden action
- Optional sections may be turned off.
- Empty optional sections must not appear in the generated file.
- Use repeatable input rows for rule lists instead of freeform giant textareas wherever possible.

### 3. Live AGENTS.md preview
- Update immediately as form state changes.
- Render preview as plain preformatted Markdown text, not rendered Markdown HTML.
- Keep preview readable with line wrapping and copy-friendly spacing.
- Downloaded filename must always be exactly `AGENTS.md`.

### 4. Heuristic lint panel
Run client-side checks and show:
- missing install, dev, build, lint, typecheck, or test coverage
- no explicit forbidden actions
- vague rules such as “do the right thing”
- leftover placeholder text
- duplicate headings
- duplicate commands
- missing commit policy
- missing branching policy
- missing repository structure guidance
- stack-inconsistent commands
- overly long sections that should be short and scannable

Each lint item must include:
- severity: `error`, `warning`, or `tip`
- short title
- one-sentence fix guidance

### 5. Export actions
- Copy to clipboard
- Download as `AGENTS.md`
- Reset current form to preset defaults
- Clear saved local draft
- Show last saved timestamp
- Show inline success or failure text for copy and save actions

### 6. Auto-save and restore
- Persist full form state in `localStorage` on meaningful changes
- Restore draft after refresh or revisit
- If `localStorage` data is corrupted or incompatible, fall back safely to defaults
- Never block the UI because of storage parse errors

### 7. Static SEO pages
- `/guide` explains the file format and practical writing principles
- `/examples` shows one copyable example per preset
- `/templates/[slug]` includes:
  - preset-specific intro
  - common commands
  - common forbidden actions
  - why this preset needs tailored guidance
  - CTA to open the generator with that preset
- Every route must have unique title, description, canonical URL, and Open Graph metadata
- Add JSON-LD:
  - `SoftwareApplication` on `/`
  - `FAQPage` on `/guide`

### 8. UX and accessibility requirements
- Responsive from 320px width to large desktop
- Keyboard-accessible controls
- Proper labels for every field
- Visible focus states
- No modal dialogs in v1
- Prefer inline validation over toast spam
- No dark mode in v1

## Data Model
Use one form-state object with these fields:
- `presetSlug`
- `projectName`
- `projectPurpose`
- `runtime`
- `packageManager`
- `installCommand`
- `devCommand`
- `lintCommand`
- `typecheckCommand`
- `buildCommand`
- `testCommand`
- `repoStructureNotes`
- `codeStyleRules[]`
- `testingRules[]`
- `securityRules[]`
- `forbiddenActions[]`
- `commitRules[]`
- `branchRules[]`
- `prRules[]`
- `extraNotes[]`
- `lastUpdated`

## Data Flow
1. Static routes are generated at build time from local content files.
2. On first load, initialize from preset defaults.
3. If a valid local draft exists, hydrate from `localStorage`.
4. If a `preset` query param exists and there is no restorable draft conflict, apply that preset.
5. Form edits update in-memory state.
6. Pass state into `build-agents-md.ts` to produce deterministic Markdown.
7. Pass state and Markdown into `lint-agents-md.ts` to produce warnings.
8. Render preview and lint results.
9. Persist the latest form state to `localStorage`.
10. Copy and download use browser APIs only.
11. No user input is sent to any server, database, or third-party API.

## Output Format Rules
Generated `AGENTS.md` must include these sections in this exact order:
1. Project purpose
2. Hard constraints
3. Setup and verification commands
4. Code conventions
5. Safety rules
6. Git workflow rules
7. Directory or architecture notes
8. Optional project-specific notes

Additional output rules:
- Markdown headings only
- no HTML in generated output
- no empty headings
- no secrets or personal data placeholders
- concise, imperative wording
- avoid vendor-specific wording unless the preset explicitly requires it

## SEO Requirements
- English-first copy on all public pages
- One H1 per page
- Internal links among `/`, `/guide`, `/examples`, and `/templates/[slug]`
- Sitemap must include all static pages and preset pages
- `robots.txt` must allow crawling
- No hidden text
- No keyword-stuffing or spun content
- No blog engine in v1

## Non-Functional Requirements
- Runtime must work in modern evergreen browsers
- No runtime dependency on external APIs
- No cookies
- No analytics SDK in v1
- No ad SDK in v1
- Keep dependencies minimal
- Keep generation and lint logic as pure functions in `/lib`
- Do not add markdown parsers, WYSIWYG editors, or form frameworks
- Prefer plain `<img>` for local assets instead of adding image complexity

## Definition of Done
A task is complete only when:
- `npm install` passes
- `npm run lint` passes
- `npm run typecheck` passes
- `npm run test` passes
- `npm run build` passes
- static export completes successfully
- generator state survives refresh
- copy and download actions work
- all preset landing pages build without runtime errors
- no obvious console errors appear in the main flow

## Out of Scope
Absolutely do not implement:
- backend servers
- databases
- authentication or user accounts
- API routes or server actions
- AI text generation or LLM API integration
- repository scanning
- GitHub OAuth
- zip upload analysis
- team collaboration
- shared drafts
- remote sync or cloud storage
- payments or subscriptions
- comments, ratings, or community features
- dashboards or analytics panels
- multilingual support
- dark mode toggle
- ad integration
- browser extension version of this product
- CMS or blog subsystem
- any feature that requires ongoing manual operations after deployment
