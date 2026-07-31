# Repository Guidelines

## Project Purpose

AGENTS.md Builder is a static web app for drafting repository instructions from five stack presets. Generation, linting, draft storage, and export all run in the browser.

## Architecture

- Keep routes in `app/`.
- Keep reusable interface components in `components/`.
- Keep preset and page copy in `content/`.
- Keep deterministic generation, linting, storage, and export logic in `lib/`.
- Keep tests in `tests/`.
- Preserve `output: "export"` in `next.config.ts`.

## Constraints

- Do not add API routes, server actions, databases, authentication, analytics, or remote generation services.
- Do not send form contents or generated documents to external services.
- Store drafts only in browser `localStorage`.
- Keep generated Markdown deterministic and reviewable as plain text.
- Avoid adding large UI, form, state-management, or Markdown dependencies.

## Development

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Update or add tests when generation, lint rules, preset defaults, or storage behavior changes. Before finishing, run lint, typecheck, tests, and a production build.

## Change Scope

- Keep changes focused on the requested behavior.
- Preserve public routes and preset slugs unless a migration is intentional.
- Document user-visible behavior changes in the pull request.
- Never commit secrets, private drafts, generated build output, or local editor configuration.
