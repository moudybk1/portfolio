"use client";

import Link from "next/link";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import SectionLink from "@/components/SectionLink";

const links = [
  { section: "about", label: "About" },
  { href: "/articles", label: "Articles" },
  { section: "contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <BrandLogo href="/" />

        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1 text-sm md:flex">
            {links.map((link) => (
              <li key={link.label}>
                {"section" in link ? (
                  <SectionLink
                    section={link.section}
                    className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {link.label}
                  </SectionLink>
                ) : (
                  <Link
                    href={link.href}
                    className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <SectionLink
            section="contact"
            className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-accent transition-colors hover:border-accent/60 md:ml-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Open to Work
          </SectionLink>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-white/5 hover:text-foreground md:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-line md:hidden">
          <ul className="mx-auto max-w-6xl space-y-1 px-6 py-4 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                {"section" in link ? (
                  <SectionLink
                    section={link.section}
                    onNavigate={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {link.label}
                  </SectionLink>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
