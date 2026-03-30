import type { Metadata } from "next";
import Link from "next/link";

import { exampleDocuments } from "@/content/examples";
import { createPresetQueryHref, createTemplateRoute } from "@/lib/routes";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "AGENTS.md examples — Preset-based sample files",
  description:
    "Browse copyable AGENTS.md examples for Next.js static, Vite React, Chrome extension, Node CLI, and Python CLI projects.",
  path: "/examples",
});

export default function ExamplesPage(): JSX.Element {
  return (
    <div className="pageStack">
      <section className="articleCard">
        <h1>Preset examples</h1>
        <p>
          These examples are generated from the same preset data the builder uses. Open a preset landing page for more
          context, or jump straight back into the generator with the preset query param applied.
        </p>
      </section>
      <div className="exampleGrid">
        {exampleDocuments.map((example) => (
          <article key={example.slug} className="exampleCard">
            <div className="sectionHeader">
              <h2>{example.name}</h2>
              <div className="inlineActions">
                <Link href={createTemplateRoute(example.slug)} className="secondaryLink">
                  View template
                </Link>
                <Link href={createPresetQueryHref(example.slug)} className="primaryLink">
                  Use preset
                </Link>
              </div>
            </div>
            <pre className="codePreview">{example.text}</pre>
          </article>
        ))}
      </div>
    </div>
  );
}
