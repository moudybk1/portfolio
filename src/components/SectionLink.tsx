"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { DECK_NAV_REQUEST } from "@/lib/portfolio-navigation";

const SCROLL_KEY = "scroll-to-section";

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "instant"
    : "smooth";
  const deck = target.closest<HTMLElement>(".deck-scroll");
  if (deck) {
    if (deck.dataset.enhanced) {
      deck.dispatchEvent(new CustomEvent(DECK_NAV_REQUEST, { detail: id }));
    } else {
      deck.scrollTo({ top: target.offsetTop, behavior });
    }
  } else {
    target.scrollIntoView({ behavior, block: "start" });
  }
}

export function queueSectionScroll(id: string) {
  sessionStorage.setItem(SCROLL_KEY, id);
}

export function consumeSectionScroll() {
  const id = sessionStorage.getItem(SCROLL_KEY);
  if (!id) return null;
  sessionStorage.removeItem(SCROLL_KEY);
  return id;
}

type SectionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  section?: string;
  href?: string;
  children: ReactNode;
  onNavigate?: () => void;
};

export default function SectionLink({
  section,
  href = "/",
  children,
  onNavigate,
  onClick,
  ...props
}: SectionLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      !section ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    event.preventDefault();
    onNavigate?.();

    if (pathname === "/") {
      scrollToSection(section);
      return;
    }

    queueSectionScroll(section);
    router.push("/");
  };

  return (
    <Link
      href={section ? `/#${section}` : href}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
