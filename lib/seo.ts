import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./defaults";
import type { FaqItem } from "./types";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
};

export function createMetadata({ title, description, path = "/" }: MetadataInput): Metadata {
  const canonical = new URL(path, SITE_URL).toString();

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
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
    url: SITE_URL,
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
