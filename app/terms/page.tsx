import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service — AGENTS.md Builder",
  description:
    "Terms of service for AGENTS.md Builder. A static utility provided as-is with no warranties.",
  path: "/terms",
});

export default function TermsPage(): JSX.Element {
  return (
    <article className="articleStack">
      <h1>Terms of Service</h1>
      <p className="mutedText">Last updated: March 31, 2026</p>

      <section className="articleCard">
        <h2>Acceptance of terms</h2>
        <p>
          By accessing and using AGENTS.md Builder, you agree to be bound by these Terms of Service. If you do not
          agree, please do not use this tool.
        </p>
      </section>

      <section className="articleCard">
        <h2>Description of service</h2>
        <p>
          AGENTS.md Builder is a free, static web utility that helps you generate AGENTS.md files for AI coding agents.
          It runs entirely in your browser with no server-side processing, no accounts, and no data collection.
        </p>
      </section>

      <section className="articleCard">
        <h2>Use of the service</h2>
        <p>You may use the builder to:</p>
        <ul className="bulletList">
          <li>Generate AGENTS.md files for your own projects.</li>
          <li>Use presets and examples as starting points for your documentation.</li>
          <li>Share links to this tool with others.</li>
        </ul>
        <p>You may not:</p>
        <ul className="bulletList">
          <li>Attempt to disrupt, overload, or interfere with the service.</li>
          <li>Use the service for any unlawful purpose.</li>
          <li>Remove or obscure any attribution or branding from the tool.</li>
        </ul>
      </section>

      <section className="articleCard">
        <h2>Intellectual property</h2>
        <p>
          The AGENTS.md files you generate belong to you. The tool&apos;s source code, design, and preset content are provided
          as-is. Preset content is designed as starting templates and may be freely modified.
        </p>
      </section>

      <section className="articleCard">
        <h2>Disclaimer of warranties</h2>
        <p>
          The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or
          implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
        </p>
      </section>

      <section className="articleCard">
        <h2>Limitation of liability</h2>
        <p>
          In no event shall the creators of AGENTS.md Builder be liable for any indirect, incidental, special,
          consequential, or punitive damages arising from your use of the service.
        </p>
      </section>

      <section className="articleCard">
        <h2>Changes to terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes
          acceptance of the updated terms.
        </p>
      </section>

      <div className="ctaRow">
        <Link href="/" className="primaryLink">Back to builder</Link>
        <Link href="/privacy" className="secondaryLink">Privacy Policy</Link>
      </div>
    </article>
  );
}
