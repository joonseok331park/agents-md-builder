import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import { createMetadata } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = createMetadata({
  title: "AGENTS.md Builder — Generate a clean AGENTS.md in your browser",
  description:
    "Generate a practical AGENTS.md from presets, structured inputs, and client-side lint checks without a backend or repository scan.",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en" className={inter.variable}>
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
            <div className="footerInner">
              <p>AGENTS.md Builder is a local-only static utility for drafting precise, copy-ready AGENTS.md files.</p>
              <nav className="footerLinks">
                <Link href="/about">About</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/contact">Contact</Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
