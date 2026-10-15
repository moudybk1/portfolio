"use client";

import { useEffect } from "react";
import {
  consumeSectionScroll,
  scrollToSection,
} from "@/components/SectionLink";

export default function HomeScrollHandler() {
  useEffect(() => {
    const navigateHash = () => {
      const id = window.location.hash.slice(1);
      if (!id || !document.getElementById(id)) return;
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
      scrollToSection(id);
    };
    // Consume only after the viewport stage mounts, so an interrupted effect
    // (including development Strict Mode) cannot discard pending navigation.
    const timer = window.setTimeout(() => {
      const queued = consumeSectionScroll();
      if (queued) {
        scrollToSection(queued);
        return;
      }
      navigateHash();
    }, 50);
    window.addEventListener("hashchange", navigateHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", navigateHash);
    };
  }, []);

  return null;
}
