import type { Metadata } from "next";
import { SITE_NAME } from "./defaults";
import type { FaqItem } from "./types";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
};

export function createMetadata({ title, description, path = "/" }: MetadataInput): Metadata {
  void path;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function createSoftwareApplicationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "A static utility that generates high-quality AGENTS.md files from presets, structured inputs, and client-side lint rules.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function createFaqJsonLd(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
