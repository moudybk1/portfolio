"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { useReducedMotion } from "@/components/useReducedMotion";
import { usePanelVisibility } from "@/components/usePanelVisibility";

const WORDS = [
  "calm",
  "trusted",
  "thoughtful",
  "clear",
  "kind",
  "reliable",
  "lasting",
  "warm",
  "dependable",
  "solid",
];

export default function TypingRotate() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = usePanelVisibility(ref);
  const [wordIndex, setWordIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const interval = setInterval(
      () => setWordIndex((index) => (index + 1) % WORDS.length),
      2800,
    );
    return () => clearInterval(interval);
  }, [reduce, paused, inView]);

  return (
    <span ref={ref} className="typing-container">
      <span className="sr-only">{WORDS[0]}</span>
      <span
        key={reduce ? 0 : wordIndex}
        className="typing-word"
        aria-hidden="true"
      >
        {WORDS[reduce ? 0 : wordIndex]}
      </span>
      {!reduce && (
        <button
          type="button"
          className="animation-control typing-control"
          aria-label={paused ? "Play text animation" : "Pause text animation"}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? (
            <Play size={12} aria-hidden="true" />
          ) : (
            <Pause size={12} aria-hidden="true" />
          )}
        </button>
      )}
    </span>
  );
}
