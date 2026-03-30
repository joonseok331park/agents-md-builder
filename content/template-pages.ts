import type { TemplatePageData } from "@/lib/types";

export const templatePages: TemplatePageData[] = [
  {
    slug: "nextjs-static",
    title: "Next.js AGENTS.md template for static export projects",
    description:
      "Generate a practical AGENTS.md for Next.js static export apps with explicit no-backend rules, verification commands, and SEO-safe guardrails.",
    h1: "Generate a Next.js static AGENTS.md",
    intro: [
      "Next.js projects need sharper constraints than generic repo templates because App Router features can quietly drift into server-only territory.",
      "This template keeps the guidance focused on static export, local data handling, SEO metadata, and deterministic browser-safe logic.",
      "Use it when you want agents to move quickly without accidentally introducing API routes, server actions, or runtime fetches.",
    ],
    whyTailored:
      "Static Next.js projects benefit from explicit export rules, route ownership guidance, and verification commands that catch server-only drift early.",
  },
  {
    slug: "vite-react",
    title: "Vite React AGENTS.md template for client-side projects",
    description:
      "Use a Vite React AGENTS.md template with clear commands, local-only data rules, and concise implementation guidance for client-side apps.",
    h1: "Generate a Vite React AGENTS.md",
    intro: [
      "Vite projects move fast, but generic repo instructions often gloss over command conventions and how much structure client-side apps really need.",
      "This preset keeps the generated file short, practical, and tuned for React plus Vite workflows without backend assumptions.",
      "It is useful when you want a clean agent contract for small to midsize frontend codebases.",
    ],
    whyTailored:
      "Vite repos need direct guidance about client-only logic, lightweight abstractions, and command consistency rather than generic full-stack rules.",
  },
  {
    slug: "chrome-extension-mv3",
    title: "Chrome extension AGENTS.md template for Manifest V3 repos",
    description:
      "Create a Manifest V3 AGENTS.md template that keeps permissions, popup and background boundaries, and extension packaging explicit.",
    h1: "Generate a Chrome extension MV3 AGENTS.md",
    intro: [
      "Browser extensions have awkward edges: popup UI, background logic, content scripts, and manifest permissions all have different failure modes.",
      "This preset gives agents a tighter contract around extension surfaces, packaging, and permission-sensitive changes.",
      "Use it when you need agent guidance that respects MV3 constraints instead of treating the repo like a normal web app.",
    ],
    whyTailored:
      "Manifest V3 repos need explicit permission and surface boundaries so agents do not hide risky extension changes inside ordinary UI work.",
  },
  {
    slug: "node-cli-ts",
    title: "Node CLI AGENTS.md template for TypeScript command tools",
    description:
      "Build a Node CLI AGENTS.md template with deterministic output rules, validation commands, and scoped filesystem guidance.",
    h1: "Generate a Node CLI TypeScript AGENTS.md",
    intro: [
      "CLI projects benefit from short, operational instructions because side effects, output formats, and filesystem behavior matter more than elaborate UI guidance.",
      "This preset focuses on command entrypoints, pure helper boundaries, and straightforward verification rules.",
      "It fits internal tools, developer CLIs, and lightweight automation repos.",
    ],
    whyTailored:
      "Node CLI repos need stronger rules around side effects, output formatting, and command scope than standard app templates provide.",
  },
  {
    slug: "python-cli",
    title: "Python CLI AGENTS.md template for typed command-line tools",
    description:
      "Generate a Python CLI AGENTS.md template with uv-based commands, deterministic guidance, and focused filesystem safety rules.",
    h1: "Generate a Python CLI AGENTS.md",
    intro: [
      "Python CLI projects often end up with vague repo instructions that say too little about packaging, validation commands, or safe automation behavior.",
      "This preset keeps the generated file concrete, typed, and friendly to modern `uv`-based workflows.",
      "Use it when you want an AGENTS.md that stays small but still protects command correctness and local-only behavior.",
    ],
    whyTailored:
      "Python CLI repos benefit from crisp command, packaging, and subprocess safety guidance instead of generic app-platform rules.",
  },
];
