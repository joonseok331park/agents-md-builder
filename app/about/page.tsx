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
          preview, fix lint warnings, and export a clean file. There is no backend, remote generation service, or
          repository scanning, and form contents stay in your browser.
        </p>
      </section>

      <section className="articleCard">
        <h2>Design principles</h2>
        <ul className="bulletList">
          <li>Static-first: the entire app is a static export with zero runtime server dependencies.</li>
          <li>Browser-local drafts: form contents are stored in localStorage and are not sent to an application server.</li>
          <li>Deterministic output: the same input always produces the same AGENTS.md.</li>
          <li>Presets over blank pages: sensible defaults for five common stacks so you edit instead of write.</li>
          <li>Lint-guided: inline warnings catch missing commands, vague rules, and stack mismatches before export.</li>
        </ul>
      </section>

      <section className="articleCard">
        <h2>Who is this for</h2>
        <p>
          Solo developers and small teams who use coding tools that read repository-level instructions and want a
          precise starting point without hand-writing a full AGENTS.md every time.
        </p>
      </section>

      <section className="articleCard">
        <h2>Technology</h2>
        <p>
          Built with Next.js App Router, TypeScript, and plain CSS. The production build is a static export that can be
          served by a static host. There are no databases, API routes, account system, or analytics SDK.
        </p>
      </section>

      <div className="ctaRow">
        <Link href="/" className="primaryLink">Try the builder</Link>
        <Link href="/guide" className="secondaryLink">Read the guide</Link>
      </div>
    </article>
  );
}
