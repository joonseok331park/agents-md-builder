import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy — AGENTS.md Builder",
  description:
    "AGENTS.md Builder keeps form contents and generated files in the browser and does not send drafts to an application server.",
  path: "/privacy",
});

export default function PrivacyPage(): JSX.Element {
  return (
    <article className="articleStack">
      <h1>Privacy Policy</h1>
      <p className="mutedText">Last updated: July 31, 2026</p>

      <section className="articleCard">
        <h2>Overview</h2>
        <p>
          AGENTS.md Builder is a fully static web application. It does not have a backend server, database, API routes,
          or any server-side processing. All data you enter remains entirely within your browser.
        </p>
      </section>

      <section className="articleCard">
        <h2>Data collection</h2>
        <p>The application does not send the following content to an application server:</p>
        <ul className="bulletList">
          <li>Form inputs such as project names, commands, or repository notes.</li>
          <li>Generated AGENTS.md file contents.</li>
          <li>Draft data saved in your browser&apos;s localStorage.</li>
          <li>Any personal information.</li>
        </ul>
      </section>

      <section className="articleCard">
        <h2>Local storage</h2>
        <p>
          The builder uses your browser&apos;s localStorage to persist drafts between sessions. This data never leaves your
          device. You can clear it at any time using the &quot;Clear saved draft&quot; button in the builder or by clearing your
          browser data.
        </p>
      </section>

      <section className="articleCard">
        <h2>Cookies</h2>
        <p>
          The application does not set tracking or session cookies.
        </p>
      </section>

      <section className="articleCard">
        <h2>Analytics</h2>
        <p>
          This site does not use any analytics services, tracking pixels, or third-party monitoring tools.
        </p>
      </section>

      <section className="articleCard">
        <h2>Hosting</h2>
        <p>
          Loading any website sends standard request information, such as an IP address, requested path, and timestamp,
          to its hosting provider. Form contents and generated documents are not included in those requests by the app.
        </p>
      </section>

      <section className="articleCard">
        <h2>Changes to this policy</h2>
        <p>
          We may update this privacy policy from time to time. Any changes will be reflected on this page with a new
          &quot;Last updated&quot; date.
        </p>
      </section>

      <div className="ctaRow">
        <Link href="/" className="primaryLink">Back to builder</Link>
        <Link href="/terms" className="secondaryLink">Terms of Service</Link>
      </div>
    </article>
  );
}
