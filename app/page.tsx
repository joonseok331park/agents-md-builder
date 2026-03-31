import Link from "next/link";

import { homeFaqItems } from "@/content/faq";
import { presets } from "@/content/presets";

import { FaqSection } from "@/components/faq-section";
import { GeneratorShell } from "@/components/generator-shell";
import { SeoJsonLd } from "@/components/seo-jsonld";

import { createSoftwareApplicationJsonLd } from "@/lib/seo";

export default function HomePage(): JSX.Element {
  return (
    <div className="pageStack">
      <SeoJsonLd data={createSoftwareApplicationJsonLd()} />
      <section className="heroCard">
        <span className="eyebrow">Static utility &middot; No backend &middot; No AI calls</span>
        <h1>Create AI-Ready Repo Documentation</h1>
        <p className="heroLead">
          Pick a preset, fill the structured fields, fix the inline lint warnings, and copy or download a clean
          AGENTS.md — without scanning your repository or sending data anywhere.
        </p>
        <div className="heroLinks">
          <Link href="#builder" className="primaryLink">
            Start building
          </Link>
          <Link href="/guide" className="secondaryLink">
            Read the guide
          </Link>
        </div>
        <div className="presetStrip">
          {presets.map((preset) => (
            <Link key={preset.slug} href={`/templates/${preset.slug}`} className="chipLink">
              {preset.shortLabel}
            </Link>
          ))}
        </div>
      </section>
      <GeneratorShell />
      <section className="infoCardGrid">
        <article className="articleCard hoverLift">
          <h2>Why this builder exists</h2>
          <p>
            Most AGENTS files fail because they are vague, missing commands, or overloaded with unrelated policy. This
            builder narrows the output to the sections agents actually need to act safely.
          </p>
        </article>
        <article className="articleCard hoverLift">
          <h2>What the lint panel checks</h2>
          <p>
            It flags missing verification commands, missing forbidden actions, vague phrases, duplicate commands,
            stack-mismatched commands, and long sections that should be shorter.
          </p>
        </article>
      </section>
      <FaqSection items={homeFaqItems} title="Builder FAQ" />
    </div>
  );
}
