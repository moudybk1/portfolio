"use client";

import { Children, useState, useSyncExternalStore, type ReactNode } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "./LatestArticles.module.css";

const compactQuery = "(max-width: 767px), (max-height: 800px)";
function subscribeCompact(onChange: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export default function LatestArticles({ children }: { children: ReactNode }) {
  const pages = Children.toArray(children);
  const [active, setActive] = useState(0);
  const selected = Math.min(active, pages.length - 1);
  const compact = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia(compactQuery).matches,
    () => false,
  );

  return (
    <div className={styles.showcase}>
      <div
        className={`latest-articles ${styles.list}`}
        aria-live={compact ? "polite" : "off"}
      >
        {pages.map((page, index) => (
          <div
            key={index}
            className={styles.page}
            data-active={index === selected}
            aria-hidden={compact && index !== selected}
            inert={compact && index !== selected}
          >
            {page}
          </div>
        ))}
      </div>
      {pages.length > 1 && (
        <div
          className={styles.controls}
          role="group"
          aria-label="Latest article pages"
        >
          <span aria-hidden="true">
            {String(selected + 1).padStart(2, "0")} /{" "}
            {String(pages.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Previous article"
            disabled={selected === 0}
            onClick={() => setActive(selected - 1)}
          >
            <CaretLeft size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next article"
            disabled={selected === pages.length - 1}
            onClick={() => setActive(selected + 1)}
          >
            <CaretRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
