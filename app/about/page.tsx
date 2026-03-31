import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About AGENTS.md Builder — Why we built this tool",
  description:
    "Learn why AGENTS.md Builder exists, how it works, and the principles behind a static, privacy-first approach to generating agent-ready documentation.",
  path: "/about",
});

export default function AboutPage(): JSX.Element {
  return (
    <article className="articleStack">
      <h1>About AGENTS.md Builder</h1>

      <section className="articleCard">
        <h2>The problem</h2>
        <p>
          Most AGENTS.md files are either copied from a template without editing or written from scratch in a rush. The
          result is usually vague, missing critical commands, or overloaded with rules that agents ignore. That wastes
          tokens, introduces errors, and slows down every coding session.
        </p>
      </section>

      <section className="articleCard">
        <h2>What this tool does</h2>
        <p>
          AGENTS.md Builder is a single-purpose static utility. You pick a preset, fill structured fields, see a live
          preview, fix lint warnings, and export a clean file. No backend, no AI calls, no repository scanning, and no
          data leaves your browser.
        </p>
      </section>

      <section className="articleCard">
        <h2>Design principles</h2>
        <ul className="bulletList">
          <li>Static-first: the entire app is a static export with zero runtime server dependencies.</li>
          <li>Privacy-first: all data stays in your browser. We never collect, transmit, or store your drafts.</li>
          <li>Deterministic output: the same input always produces the same AGENTS.md.</li>
          <li>Presets over blank pages: sensible defaults for five common stacks so you edit instead of write.</li>
          <li>Lint-guided: inline warnings catch missing commands, vague rules, and stack mismatches before export.</li>
        </ul>
      </section>

      <section className="articleCard">
        <h2>Who is this for</h2>
        <p>
          Solo developers and small teams who use AI coding agents like Codex, Copilot, Cursor, or Claude Code and want
          to give those agents precise, actionable context without hand-writing a full AGENTS.md every time.
        </p>
      </section>

      <section className="articleCard">
        <h2>Technology</h2>
        <p>
          Built with Next.js App Router, TypeScript, and plain CSS. Deployed as a fully static site on Cloudflare Pages.
          No databases, no API routes, no cookies, no analytics SDK, no paid services.
        </p>
      </section>

      <div className="ctaRow">
        <Link href="/" className="primaryLink">Try the builder</Link>
        <Link href="/guide" className="secondaryLink">Read the guide</Link>
      </div>
    </article>
  );
}
