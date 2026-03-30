# AGENTS.md Builder

AGENTS.md Builder is a static, privacy-first web app for generating high-quality `AGENTS.md` files from presets, structured inputs, and client-side lint rules.

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `./scripts/harness/local_checks.sh`

## Deployment

- Static export only via Next.js
- Intended host: Cloudflare Pages

## Harness Workflow

- `Ctrl+Shift+P -> Run Task -> Harness: Next Step`
- `Ctrl+Shift+P -> Run Task -> Harness: Ship`
