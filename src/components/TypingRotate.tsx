"use client";

import { useEffect, useState } from "react";

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

const TYPE_MS = 80;
const DELETE_MS = 45;
const HOLD_MS = 1600;
const GAP_MS = 280;

export default function TypingRotate() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState(WORDS[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), HOLD_MS);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % WORDS.length);
      }, GAP_MS);
    } else if (deleting) {
      timeout = setTimeout(() => setText((t) => t.slice(0, -1)), DELETE_MS);
    } else {
      timeout = setTimeout(
        () => setText(current.slice(0, text.length + 1)),
        TYPE_MS
      );
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex]);

  return (
    <span className="whitespace-nowrap text-accent">
      {text}
      <span
        className="ml-px inline-block h-[0.85em] w-[2px] translate-y-[0.08em] bg-accent align-baseline animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
}
