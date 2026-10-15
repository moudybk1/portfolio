"use client";

import { useEffect, type RefObject } from "react";
import { DECK_PAGE_CHANGE } from "@/lib/portfolio-navigation";

type MotionGroup = {
  selector: string;
  delay: number;
  stagger?: number;
  distance?: number;
  media?: boolean;
};

// The order guides reading within a chapter, independently of the screen switch.
const chapterMotion: Record<string, MotionGroup[]> = {
  home: [
    { selector: ".deck-role", delay: 0, distance: 8 },
    { selector: ".deck-hero-title", delay: 70, distance: 24 },
    { selector: ".deck-hero-description", delay: 140 },
    { selector: ".deck-hero-actions", delay: 210, distance: 10 },
    { selector: ".deck-writing-link", delay: 260, distance: 8 },
    { selector: ".deck-hero-ticket", delay: 180, media: true },
  ],
  work: [
    { selector: ".deck-label", delay: 0, distance: 8 },
    { selector: ".deck-heading h2", delay: 70, distance: 20 },
    { selector: ".experience-navigation", delay: 140, distance: 8 },
    { selector: ".experience-rail", delay: 220 },
  ],
  about: [
    { selector: ".deck-label", delay: 0, distance: 8 },
    { selector: ".deck-heading h2", delay: 70, distance: 20 },
    { selector: ".about-reading", delay: 150 },
    { selector: ".deck-about-photo", delay: 220, media: true },
  ],
  approach: [
    { selector: ".deck-approach-copy", delay: 0, distance: 20 },
    { selector: ".principle", delay: 140, stagger: 70, distance: 12 },
  ],
  toolkit: [
    { selector: ".deck-label", delay: 0, distance: 8 },
    { selector: ".deck-heading h2", delay: 70, distance: 20 },
    { selector: ".deck-tool", delay: 140, stagger: 45, distance: 14 },
  ],
  "ai-playground": [
    { selector: ".deck-label", delay: 0, distance: 8 },
    { selector: ".deck-heading h2", delay: 70, distance: 20 },
    { selector: ".playground-description", delay: 150 },
    { selector: ".playground-project", delay: 220 },
  ],
  writing: [
    { selector: ".deck-label", delay: 0, distance: 8 },
    { selector: ".deck-heading h2", delay: 70, distance: 20 },
    { selector: ".deck-writing-heading > .text-link", delay: 140 },
    { selector: ".article-preview", delay: 180, stagger: 65 },
  ],
  contact: [
    { selector: ".contact-title", delay: 0, distance: 24 },
    { selector: ".contact-copy > p", delay: 140 },
    { selector: ".contact-link", delay: 220, stagger: 80, distance: 12 },
  ],
  connect: [
    { selector: "[data-footer-brand]", delay: 0, distance: 20 },
    { selector: "[data-footer-label]", delay: 100, stagger: 50, distance: 8 },
    { selector: "[data-footer-links] li", delay: 150, stagger: 30, distance: 10 },
    { selector: "[data-footer-bottom]", delay: 270, distance: 8 },
  ],
};

export function usePortfolioMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia(
      "(max-width: 767px), (max-height: 560px)",
    );
    let animations: Animation[] = [];
    let activePanel: HTMLElement | null = null;
    let generation = 0;

    function cancel() {
      generation += 1;
      animations.forEach((animation) => animation.cancel());
      animations = [];
      if (activePanel) delete activePanel.dataset.contentMotion;
      activePanel = null;
    }

    function enter() {
      cancel();
      const panel = root!.querySelector<HTMLElement>(
        '.deck-panel[data-active="true"]',
      );
      if (!panel || preference.matches || typeof panel.animate !== "function")
        return;
      const groups = chapterMotion[panel.id];
      if (!groups) return;
      activePanel = panel;
      panel.dataset.contentMotion = "entering";
      const currentGeneration = generation;

      for (const group of groups) {
        const elements = panel.querySelectorAll<HTMLElement>(group.selector);
        elements.forEach((element, index) => {
          const distance = (group.distance ?? 16) * (compact.matches ? 0.65 : 1);
          const animation = element.animate(
            [
              {
                opacity: 0,
                transform: `translate3d(0, ${distance}px, 0)${group.media ? " scale(.975)" : ""}`,
              },
              { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
            ],
            {
              duration: group.media ? 780 : 620,
              delay: 120 + group.delay + index * (group.stagger ?? 0),
              easing: "cubic-bezier(.22, 1, .36, 1)",
              fill: "both",
            },
          );
          animations.push(animation);
        });
      }

      Promise.allSettled(animations.map((animation) => animation.finished)).then(
        () => {
          if (currentGeneration !== generation) return;
          animations.forEach((animation) => animation.cancel());
          animations = [];
          panel.dataset.contentMotion = "ready";
        },
      );
    }

    function onPreferenceChange() {
      // A changed preference clears running effects without replaying the page.
      if (preference.matches) cancel();
    }

    root.addEventListener(DECK_PAGE_CHANGE, enter);
    preference.addEventListener("change", onPreferenceChange);
    enter();
    return () => {
      root.removeEventListener(DECK_PAGE_CHANGE, enter);
      preference.removeEventListener("change", onPreferenceChange);
      cancel();
    };
  }, [rootRef]);
}
