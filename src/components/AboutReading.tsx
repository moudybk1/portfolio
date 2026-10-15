"use client";

import {
  Children,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const compactQuery = "(max-width: 767px), (max-height: 560px)";

function subscribeCompact(onChange: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** Keep the original server-rendered paragraphs readable in a compact frame. */
export default function AboutReading({ children }: { children: ReactNode }) {
  const paragraphs = Children.toArray(children);
  const [active, setActive] = useState(0);
  const compact = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia(compactQuery).matches,
    () => false,
  );

  return (
    <div className="about-reading">
      <div className="deck-about-copy" aria-live={compact ? "polite" : "off"}>
        {paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className="about-reading-item"
            data-active={active === index}
            aria-hidden={compact && active !== index}
            inert={compact && active !== index}
          >
            {paragraph}
          </div>
        ))}
      </div>
      <div
        className="about-reading-controls"
        role="group"
        aria-label="About paragraphs"
      >
        <button
          type="button"
          aria-label="Previous about paragraph"
          disabled={active === 0}
          onClick={() => setActive((index) => index - 1)}
        >
          <CaretLeft size={14} aria-hidden="true" />
        </button>
        <span aria-hidden="true">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(paragraphs.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label="Next about paragraph"
          disabled={active === paragraphs.length - 1}
          onClick={() => setActive((index) => index + 1)}
        >
          <CaretRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
