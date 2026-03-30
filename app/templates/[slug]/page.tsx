import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { presets, presetMap } from "@/content/presets";
import { templatePages } from "@/content/template-pages";
import { createPresetQueryHref } from "@/lib/routes";
import { createMetadata } from "@/lib/seo";
import type { PresetSlug } from "@/lib/types";

const templatePageMap = Object.fromEntries(templatePages.map((page) => [page.slug, page])) as Record<PresetSlug, (typeof templatePages)[number]>;

type TemplatePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: PresetSlug }> {
  return presets.map((preset) => ({ slug: preset.slug }));
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = templatePageMap[slug as PresetSlug];
  if (!page) {
    return createMetadata({
      title: "Template not found",
      description: "The requested AGENTS.md template does not exist.",
      path: "/templates",
    });
  }

  return createMetadata({
    title: page.title,
    description: page.description,
    path: `/templates/${page.slug}`,
  });
}

export default async function TemplatePage({ params }: TemplatePageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const presetSlug = slug as PresetSlug;
  const page = templatePageMap[presetSlug];
  const preset = presetMap[presetSlug];

  if (!page || !preset) {
    notFound();
  }

  return (
    <article className="articleStack">
      <h1>{page.h1}</h1>
      {page.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <section className="articleCard">
        <h2>Common commands</h2>
        <ul className="bulletList">
          <li>
            Install: <code>{preset.installCommand}</code>
          </li>
          <li>
            Dev: <code>{preset.devCommand}</code>
          </li>
          <li>
            Lint: <code>{preset.lintCommand}</code>
          </li>
          <li>
            Typecheck: <code>{preset.typecheckCommand}</code>
          </li>
          <li>
            Build: <code>{preset.buildCommand}</code>
          </li>
          <li>
            Test: <code>{preset.testCommand}</code>
          </li>
        </ul>
      </section>
      <section className="articleCard">
        <h2>Common forbidden actions</h2>
        <ul className="bulletList">
          {preset.forbiddenActions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="articleCard">
        <h2>Why this preset needs tailored guidance</h2>
        <p>{page.whyTailored}</p>
      </section>
      <div className="ctaRow">
        <Link href={createPresetQueryHref(preset.slug)} className="primaryLink">
          Open generator with this preset
        </Link>
        <Link href="/examples" className="secondaryLink">
          Browse all examples
        </Link>
      </div>
    </article>
  );
}
