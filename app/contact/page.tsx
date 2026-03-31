import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact — AGENTS.md Builder",
  description: "Get in touch with the AGENTS.md Builder team. Report issues, suggest features, or ask questions.",
  path: "/contact",
});

export default function ContactPage(): JSX.Element {
  return (
    <article className="articleStack">
      <h1>Contact</h1>

      <section className="articleCard">
        <h2>Get in touch</h2>
        <p>
          AGENTS.md Builder is an open-source project. The best way to reach us is through GitHub.
        </p>
      </section>

      <section className="articleCard">
        <h2>Report a bug or request a feature</h2>
        <p>
          Open an issue on the{" "}
          <a
            href="https://github.com/joonseok331park/agents-md-builder/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Issues page
          </a>. Please include:
        </p>
        <ul className="bulletList">
          <li>What browser and device you were using.</li>
          <li>Steps to reproduce the issue.</li>
          <li>What you expected to happen versus what actually happened.</li>
        </ul>
      </section>

      <section className="articleCard">
        <h2>Suggest a preset</h2>
        <p>
          If you want a preset for a stack that is not currently supported, open a GitHub issue with the label
          &quot;preset-request&quot; and include the common commands, default forbidden actions, and directory conventions for
          your stack.
        </p>
      </section>

      <section className="articleCard">
        <h2>General questions</h2>
        <p>
          For general questions, feedback, or suggestions, feel free to open a GitHub Discussion on the repository.
        </p>
      </section>

      <div className="ctaRow">
        <Link href="/" className="primaryLink">Back to builder</Link>
        <a
          href="https://github.com/joonseok331park/agents-md-builder"
          target="_blank"
          rel="noopener noreferrer"
          className="secondaryLink"
        >
          View on GitHub
        </a>
      </div>
    </article>
  );
}
