"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

const SCROLL_KEY = "scroll-to-section";

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
    if (event.defaultPrevented || !section) return;

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
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
