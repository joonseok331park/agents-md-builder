# AGENTS.md

## Mission
Build and maintain a static, SEO-first utility that generates high-quality `AGENTS.md` files with zero backend, zero external API dependence, and near-zero maintenance after deployment.

## Hard Constraints
- Keep the app fully static. `next.config.ts` must remain `output: 'export'`.
- Do not add backend code, API routes, route handlers, server actions, ISR, databases, auth, cookies, analytics SDKs, or AI API calls.
- All user data must remain in browser memory and `localStorage` only.
- Do not add runtime fetches to remote domains.
- Do not add paid services, SaaS dependencies, or vendor lock-in.
- Do not add heavy UI, form, markdown, or state-management libraries without explicit user approval.

## Harness Coordination Rules
- Claude Code (configured to GLM-5.1) is the default orchestrator and the only writer.
- Codex and Gemini are read-only reviewers only.
- External reviewers must never receive private local drafts or any file excluded by the sanitized review workspace.
- If a change touches excluded files, external review must use the sanitized workspace or be skipped.
- Implement one feature or fix at a time.
- Prefer the smallest safe diff.
- Keep the app working after every step.

## Allowed Stack
- Next.js App Router
- TypeScript strict mode
- Plain CSS in `app/globals.css`
- React client components only where browser APIs are needed
- `localStorage` for persistence
- Cloudflare Pages as the deployment target

## Repository Structure Rules
- Routes belong in `/app`
- Reusable UI belongs in `/components`
- Static copy and preset data belong in `/content`
- Pure logic belongs in `/lib`
- Public assets belong in `/public`
- Tests belong in `/tests`
- Harness automation belongs in `/scripts/harness`
- Do not mix preset data into components
- Do not place browser-only logic in server components

## Implementation Order
When building a new feature, follow this order:
1. Update types and defaults if the data shape changes.
2. Implement or adjust pure logic in `/lib`.
3. Wire the UI in `/components`.
4. Mount the feature from the appropriate route in `/app`.
5. Run validation commands.
6. Commit only after the feature works end-to-end.

## Safety Rules
- Before deleting or heavily rewriting existing code, ask the user first.
- Before removing a public route, preset slug, exported helper, or large content block, ask the user first.
- Implement one feature at a time. Do not combine unrelated work in one pass.
- Preserve existing SEO pages and metadata unless the task explicitly changes them.
- Never claim manual verification unless it was actually performed.
- Never leave the repository in a broken state.
- Never commit code that fails lint, typecheck, test, or build.

## GitHub Workflow Rules
1. After every logical unit of completed work, create a Git commit.
2. Commit messages must follow Conventional Commits, for example `feat: add preset picker` or `fix: handle corrupted localStorage draft`.
3. Do not commit in a broken state. Validate first.
4. When changing existing behavior, create a new branch such as `feature/preset-lint-panel` or `fix/download-filename`, complete the work there, and merge into `main` only after validation passes.
5. Keep commits small, reversible, and scoped to one concern.

## Required Local Commands
Use `npm` for this repository.

Run these before finishing any task and before every commit:
- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Use during development:
- `npm run dev`

## Code Conventions
- Use TypeScript strict mode and avoid `any`.
- Prefer explicit types for exported functions and objects.
- Prefer small pure functions over clever abstractions.
- Keep Markdown generation deterministic.
- Keep lint logic deterministic and side-effect free.
- Use clear names, short functions, and early returns.
- Avoid duplicate state.
- Avoid unnecessary abstraction layers.
- Do not introduce markdown renderers or WYSIWYG editors.
- Keep generated copy concise, imperative, and easy for agents to scan.

## UI Conventions
- Main flow must remain readable on mobile and desktop.
- Use semantic HTML and accessible labels.
- Prefer inline validation and inline status messages.
- Keep preview as plain text, not rendered markdown.
- Keep export actions visually close to the preview.
- Do not add modal-heavy UX.
- Keep the generator above the fold on the home page.

## Storage Rules
- Access `localStorage` only in client-safe code.
- Handle missing, stale, or corrupted stored data gracefully.
- Never store secrets, tokens, or identifiers.
- Persist only what is needed to restore the form.

## Route and SEO Rules
- Every public route must be statically renderable.
- Dynamic preset pages must use build-time generated params only.
- Maintain `robots.ts` and `sitemap.ts`.
- Preserve internal linking among the main SEO pages.
- Do not add thin, duplicate, or filler pages to inflate page count.
- SEO content must be human-readable first.

## Forbidden Additions
Do not add:
- backend services
- external APIs
- AI generation features
- login or account systems
- cloud sync
- payment code
- analytics dashboards
- CMS or blog systems
- localization
- ad scripts in MVP
- browser extension packaging for this product

## Completion Checklist
Before declaring work done, confirm:
- the changed feature works manually when feasible
- lint passes
- typecheck passes
- tests pass
- build passes
- static export still succeeds
- no obvious regression was introduced
