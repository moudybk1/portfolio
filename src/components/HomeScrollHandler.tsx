"use client";

import { useEffect } from "react";
import { consumeSectionScroll, scrollToSection } from "@/components/SectionLink";

export default function HomeScrollHandler() {
  useEffect(() => {
    const queued = consumeSectionScroll();
    if (queued) {
      // Wait a tick so the home page layout is ready after client navigation.
      const timer = window.setTimeout(() => scrollToSection(queued), 50);
      return () => window.clearTimeout(timer);
    }

    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      window.history.replaceState(null, "", window.location.pathname);
      const timer = window.setTimeout(() => scrollToSection(id), 50);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return null;
}
