import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = createMetadata({
  title: "AGENTS.md Builder — Generate a clean AGENTS.md in your browser",
  description:
    "Generate a practical AGENTS.md from presets, structured inputs, and client-side lint checks. No backend, no AI API, and no repository scan required.",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body>
        <div className="siteShell">
          <header className="siteHeader">
            <Link href="/" className="brandLink">
              AGENTS.md Builder
            </Link>
            <nav className="topNav" aria-label="Primary">
              <Link href="/">Builder</Link>
              <Link href="/guide">Guide</Link>
              <Link href="/examples">Examples</Link>
            </nav>
          </header>
          <main className="pageContainer">{children}</main>
          <footer className="siteFooter">
            <p>AGENTS.md Builder is a local-only static utility for drafting precise, copy-ready AGENTS.md files.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
