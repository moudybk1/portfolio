"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/components/useReducedMotion";

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (reduce || !window.IntersectionObserver) {
      element.dataset.reveal = "visible";
      return;
    }

    // Content stays readable without JavaScript. Only offscreen content waits.
    if (element.getBoundingClientRect().top < window.innerHeight - 40) {
      element.dataset.reveal = "visible";
      return;
    }
    element.dataset.reveal = "waiting";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.reveal = "visible";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
