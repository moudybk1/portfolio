"use client";

import { useEffect, useState, type RefObject } from "react";
import { DECK_PAGE_CHANGE } from "@/lib/portfolio-navigation";

export function usePanelVisibility(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const panel = element.closest<HTMLElement>(".deck-panel");
    const stage = element.closest<HTMLElement>(".deck-scroll");
    let intersecting = false;
    function update() {
      // Stacked screens share geometry. Visibility also depends on the active page.
      setVisible(
        intersecting &&
          (!stage?.dataset.enhanced || panel?.dataset.active === "true"),
      );
    }
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    stage?.addEventListener(DECK_PAGE_CHANGE, update);
    return () => {
      observer.disconnect();
      stage?.removeEventListener(DECK_PAGE_CHANGE, update);
    };
  }, [ref]);

  return visible;
}
