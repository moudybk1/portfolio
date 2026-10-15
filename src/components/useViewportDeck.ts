"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  DECK_NAV_REQUEST,
  DECK_PAGE_CHANGE,
  type DeckChapter,
} from "@/lib/portfolio-navigation";

export function useViewportDeck(
  rootRef: RefObject<HTMLElement | null>,
  chapters: DeckChapter[],
  onPageChange: (index: number) => void,
) {
  const indexRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panels = Array.from(
      root.querySelectorAll<HTMLElement>(".deck-panel"),
    );
    if (!panels.length) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = Math.min(indexRef.current, panels.length - 1);
    let disposed = false;
    let moving = false;
    let pending: number | null = null;
    let animations: Animation[] = [];
    let wheelSum = 0;
    let lastWheel = 0;
    let wheelLocked = false;
    let quietTimer: ReturnType<typeof setTimeout> | undefined;
    let touch: { x: number; y: number; reading: boolean } | null = null;

    const content = () =>
      panels[current].querySelector<HTMLElement>(".panel-scroll");
    function canRead(direction: number) {
      const element = content();
      if (!element) return false;
      const max = element.scrollHeight - element.clientHeight;
      return (
        max > 2 &&
        (direction > 0 ? element.scrollTop < max - 2 : element.scrollTop > 2)
      );
    }

    function announce() {
      root!.dispatchEvent(new CustomEvent(DECK_PAGE_CHANGE));
    }

    function select(index: number) {
      panels.forEach((panel, panelIndex) => {
        panel.dataset.active = String(panelIndex === index);
        panel.inert = panelIndex !== index;
      });
      indexRef.current = index;
      announce();
    }

    function settle() {
      if (disposed) return;
      animations.forEach((animation) => animation.cancel());
      animations = [];
      panels.forEach((panel) => delete panel.dataset.transitioning);
      root!.removeAttribute("aria-busy");
      moving = false;
      const next = pending;
      pending = null;
      if (next !== null && next !== current) navigate(next);
    }

    function navigate(index: number) {
      if (index < 0 || index >= panels.length) return;
      if (moving) {
        // Keep the latest deliberate navigation request; wheel momentum never queues.
        pending = index === current ? null : index;
        return;
      }
      if (index === current) return;
      const previous = panels[current];
      const incoming = panels[index];
      const direction = index > current ? 1 : -1;
      if (previous.contains(document.activeElement))
        root!.focus({ preventScroll: true });
      incoming
        .querySelector<HTMLElement>(".panel-scroll")
        ?.scrollTo({ top: 0, behavior: "instant" });
      current = index;
      select(index);
      onPageChange(index);
      if (media.matches || typeof incoming.animate !== "function") return;

      moving = true;
      root!.setAttribute("aria-busy", "true");
      previous.dataset.transitioning = "out";
      incoming.dataset.transitioning = "in";
      // Animate the two screen layers, never a long document scroll offset.
      const outgoing = previous.animate(
        [
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          {
            opacity: 0,
            transform: `translate3d(0, ${-direction * 5}%, 0) scale(.985)`,
          },
        ],
        { duration: 280, easing: "cubic-bezier(.4, 0, .2, 1)", fill: "both" },
      );
      const entering = incoming.animate(
        [
          {
            opacity: 0,
            transform: `translate3d(0, ${direction * 7}%, 0) scale(1.015)`,
          },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        ],
        {
          duration: 820,
          delay: 160,
          easing: "cubic-bezier(.16, 1, .3, 1)",
          fill: "both",
        },
      );
      animations = [outgoing, entering];
      entering.finished.then(settle, () => {
        /* Cancellation is handled by cleanup or reduced motion. */
      });
    }

    function releaseWheelAfterQuiet() {
      clearTimeout(quietTimer);
      quietTimer = setTimeout(() => {
        wheelLocked = false;
        wheelSum = 0;
      }, 220);
    }

    function onWheel(event: WheelEvent) {
      // Preserve pinch zoom and the horizontal experience gallery.
      if (
        event.ctrlKey ||
        event.shiftKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        !event.deltaY
      )
        return;
      if (moving || wheelLocked) {
        event.preventDefault();
        releaseWheelAfterQuiet();
        return;
      }
      const direction = Math.sign(event.deltaY);
      if (canRead(direction)) {
        wheelSum = 0;
        return;
      }
      event.preventDefault();
      const now = performance.now();
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? root!.clientHeight
            : 1);
      if (now - lastWheel > 180 || Math.sign(wheelSum) !== direction)
        wheelSum = 0;
      lastWheel = now;
      wheelSum += delta;
      if (Math.abs(wheelSum) < 45) return;
      wheelLocked = true;
      releaseWheelAfterQuiet();
      navigate(current + direction);
    }

    function onKey(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable='true']"))
        return;
      if (event.key === " " && target.closest("button, a, summary")) return;
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        navigate(event.key === "Home" ? 0 : panels.length - 1);
        return;
      }
      const direction =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey)
          ? 1
          : event.key === "ArrowUp" ||
              event.key === "PageUp" ||
              (event.key === " " && event.shiftKey)
            ? -1
            : 0;
      if (!direction) return;
      event.preventDefault();
      if (moving) return;
      if (canRead(direction)) {
        content()?.scrollBy({
          top: direction * root!.clientHeight * 0.8,
          behavior: media.matches ? "instant" : "smooth",
        });
      } else navigate(current + direction);
    }

    function onTouchStart(event: TouchEvent) {
      touch =
        event.touches.length === 1
          ? {
              x: event.touches[0].clientX,
              y: event.touches[0].clientY,
              reading: false,
            }
          : null;
    }
    function onTouchMove(event: TouchEvent) {
      if (!touch || event.touches.length !== 1) {
        touch = null;
        return;
      }
      const dx = event.touches[0].clientX - touch.x;
      const dy = touch.y - event.touches[0].clientY;
      if (Math.abs(dy) < 8 || Math.abs(dx) > Math.abs(dy)) return;
      if (moving) {
        event.preventDefault();
        return;
      }
      if (touch.reading || canRead(Math.sign(dy))) {
        touch.reading = true;
        return;
      }
      event.preventDefault();
    }
    function onTouchEnd(event: TouchEvent) {
      const start = touch;
      touch = null;
      if (!start || start.reading || moving || !event.changedTouches.length)
        return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = start.y - event.changedTouches[0].clientY;
      if (Math.abs(dy) < 42 || Math.abs(dy) < Math.abs(dx) * 1.2) return;
      if (canRead(Math.sign(dy))) return;
      event.preventDefault();
      navigate(current + Math.sign(dy));
    }
    function onTouchCancel() {
      touch = null;
    }
    function onRequest(event: Event) {
      const id = (event as CustomEvent<string>).detail;
      const index = chapters.findIndex((chapter) => chapter.id === id);
      if (index !== -1) navigate(index);
    }
    function onMotionPreference() {
      if (media.matches && moving) {
        pending = null;
        settle();
      }
    }

    root.scrollTop = 0;
    root.dataset.enhanced = "true";
    select(current);
    root.addEventListener(DECK_NAV_REQUEST, onRequest);
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("keydown", onKey);
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd, { passive: false });
    root.addEventListener("touchcancel", onTouchCancel);
    media.addEventListener("change", onMotionPreference);
    return () => {
      disposed = true;
      clearTimeout(quietTimer);
      animations.forEach((animation) => animation.cancel());
      root.removeEventListener(DECK_NAV_REQUEST, onRequest);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("keydown", onKey);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchCancel);
      media.removeEventListener("change", onMotionPreference);
      root.removeAttribute("aria-busy");
      delete root.dataset.enhanced;
      panels.forEach((panel) => {
        panel.inert = false;
        delete panel.dataset.active;
        delete panel.dataset.transitioning;
      });
    };
  }, [chapters, rootRef, onPageChange]);
}
