import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy — AGENTS.md Builder",
  description:
    "Privacy policy for AGENTS.md Builder. Learn how we handle data: everything stays in your browser, nothing is collected or transmitted.",
  path: "/privacy",
});

export default function PrivacyPage(): JSX.Element {
  return (
    <article className="articleStack">
      <h1>Privacy Policy</h1>
      <p className="mutedText">Last updated: March 31, 2026</p>

      <section className="articleCard">
        <h2>Overview</h2>
        <p>
          AGENTS.md Builder is a fully static web application. It does not have a backend server, database, API routes,
          or any server-side processing. All data you enter remains entirely within your browser.
        </p>
      </section>

      <section className="articleCard">
        <h2>Data collection</h2>
        <p>We do not collect, store, transmit, or have access to any of the following:</p>
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
          This site does not use cookies. No tracking cookies, session cookies, or third-party cookies are set.
        </p>
      </section>

      <section className="articleCard">
        <h2>Analytics</h2>
        <p>
          This site does not use any analytics services, tracking pixels, or third-party monitoring tools.
        </p>
      </section>

      <section className="articleCard">
        <h2>Third-party services</h2>
        <p>
          This site is hosted on Cloudflare Pages, which may collect standard web server logs (IP address, request URL,
          timestamp) as part of its content delivery network infrastructure. These logs are governed by{" "}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
            Cloudflare&apos;s Privacy Policy
          </a>.
        </p>
      </section>

      <section className="articleCard">
        <h2>Advertising</h2>
        <p>
          We may display advertisements through Google AdSense in the future. Google and its partners may use cookies to
          serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by
          visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>.
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
