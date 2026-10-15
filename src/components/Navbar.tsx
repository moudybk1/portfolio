"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import BrandLogo from "@/components/BrandLogo";
import SectionLink, { scrollToSection } from "@/components/SectionLink";
import ThemeToggle from "@/components/ThemeToggle";
import { DECK_PAGE_CHANGE } from "@/lib/portfolio-navigation";
import "./Navbar.css";

const links = [
  { section: "about", label: "About" },
  { section: "ai-playground", label: "AI Playground" },
  { href: "/articles", label: "Articles" },
  { section: "contact", label: "Contact" },
] as const;

function subscribePage(onChange: () => void) {
  document.addEventListener(DECK_PAGE_CHANGE, onChange, true);
  return () => document.removeEventListener(DECK_PAGE_CHANGE, onChange, true);
}
function currentSection() {
  return (
    document.querySelector<HTMLElement>(".deck-panel[data-active='true']")
      ?.id ?? "home"
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const section = useSyncExternalStore(
    subscribePage,
    currentSection,
    () => "home",
  );
  const closeMenu = () => flushSync(() => setMenuOpen(false));

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node))
        setMenuOpen(false);
    };
    const media = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    media.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="site-header">
      <nav className="site-container nav-content" aria-label="Main navigation">
        <BrandLogo
          href="/"
          onClick={(event) => {
            closeMenu();
            if (
              pathname !== "/" ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            event.preventDefault();
            scrollToSection("home");
          }}
        />
        <ul className="desktop-nav">
          {links.map((link) => (
            <li key={link.label}>
              {"section" in link ? (
                <SectionLink
                  section={link.section}
                  className="nav-link"
                  aria-current={
                    pathname === "/" && section === link.section
                      ? "location"
                      : undefined
                  }
                >
                  {link.label}
                </SectionLink>
              ) : (
                <Link
                  href={link.href}
                  className="nav-link"
                  aria-current={
                    pathname.startsWith(link.href) ? "page" : undefined
                  }
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <SectionLink
            section="contact"
            className="availability-link"
            onNavigate={closeMenu}
          >
            <span className="availability-dot" aria-hidden="true" />
            Open to Work
            <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
          </SectionLink>
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="menu-toggle"
          >
            {menuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </nav>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        <ul className="site-container">
          {links.map((link) => (
            <li key={link.label}>
              {"section" in link ? (
                <SectionLink
                  section={link.section}
                  onNavigate={closeMenu}
                  aria-current={
                    pathname === "/" && section === link.section
                      ? "location"
                      : undefined
                  }
                >
                  {link.label}
                  <ArrowUpRight size={22} aria-hidden="true" />
                </SectionLink>
              ) : (
                <Link href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                  <ArrowUpRight size={22} aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
