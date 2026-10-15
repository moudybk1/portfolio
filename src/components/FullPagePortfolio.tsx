"use client";

import { useRef, useState, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import HomeScrollHandler from "@/components/HomeScrollHandler";
import { scrollToSection } from "@/components/SectionLink";
import { useViewportDeck } from "@/components/useViewportDeck";
import { usePortfolioMotion } from "@/components/usePortfolioMotion";
import type { DeckChapter } from "@/lib/portfolio-navigation";

export default function FullPagePortfolio({
  children,
  chapters,
}: {
  children: ReactNode;
  chapters: DeckChapter[];
}) {
  const scroller = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useViewportDeck(scroller, chapters, setActive);
  usePortfolioMotion(scroller);

  return (
    <div className="public-site portfolio-deck">
      <HomeScrollHandler />
      <Navbar />
      <main
        id="main-content"
        ref={scroller}
        className="deck-scroll"
        tabIndex={0}
        aria-label="Portfolio"
      >
        {children}
      </main>
      <nav className="deck-indicator" aria-label="Portfolio sections">
        <ol className="deck-indicator-pages">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <button
                type="button"
                aria-label={`${chapter.label}, page ${index + 1} of ${chapters.length}`}
                aria-current={active === index ? "step" : undefined}
                onClick={() => scrollToSection(chapter.id)}
              >
                <span className="deck-indicator-line" aria-hidden="true" />
                <span className="deck-indicator-label" aria-hidden="true">
                  {chapter.label}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div
          className="deck-indicator-position"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">{chapters[active]?.label}, page </span>
          <span>{String(active + 1).padStart(2, "0")}</span>
          <span className="deck-indicator-divider" aria-hidden="true">
            /
          </span>
          <span className="sr-only"> of </span>
          <span className="deck-indicator-total">
            {String(chapters.length).padStart(2, "0")}
          </span>
        </div>
      </nav>
    </div>
  );
}
