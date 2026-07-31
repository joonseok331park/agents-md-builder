import type { Metadata } from "next";
import Link from "next/link";

import { guideFaqItems } from "@/content/faq";
import { createMetadata, createFaqJsonLd } from "@/lib/seo";

import { FaqSection } from "@/components/faq-section";
import { SeoJsonLd } from "@/components/seo-jsonld";

export const metadata: Metadata = createMetadata({
  title: "AGENTS.md guide — How to write precise rules for coding agents",
  description:
    "Learn what AGENTS.md should contain, why presets help, and how to write clear repository rules for coding tools.",
  path: "/guide",
});

export default function GuidePage(): JSX.Element {
  return (
    <article className="articleStack">
      <SeoJsonLd data={createFaqJsonLd(guideFaqItems)} />
      <h1>How to write a useful AGENTS.md</h1>
      <p>
        A strong AGENTS.md is not a prompt dump. It is a compact operating contract for an agent working inside a real
        repository.
      </p>
      <p>
        The best files are specific about purpose, hard constraints, verification commands, Git workflow, and where key
        parts of the codebase live. They avoid vague phrases and unnecessary prose.
      </p>
      <h2>Good AGENTS.md principles</h2>
      <ul className="bulletList">
        <li>Say what the project does in one sentence.</li>
        <li>List the behaviors the agent must never introduce.</li>
        <li>Give exact install, lint, typecheck, test, and build commands when they exist.</li>
        <li>Explain where routes, logic, content, and shared UI should live.</li>
        <li>Keep the wording imperative and easy to scan.</li>
      </ul>
      <p>
        The builder presets give you a strong default so you can edit the important details instead of starting from a
        blank page. If you want to inspect the generated examples first, go to the <Link href="/examples">examples page</Link>.
      </p>
      <FaqSection items={guideFaqItems} title="Guide FAQ" />
    </article>
  );
}
