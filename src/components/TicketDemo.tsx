"use client";

import { useEffect, useState } from "react";

type Message = {
  from: "user" | "moudy";
  time: string;
  text: string;
};

const messages: Message[] = [
  {
    from: "user",
    time: "14:02 UTC",
    text: "gm — my bridge tx has been pending for 40 minutes. Did I just lose my funds? 😰",
  },
  {
    from: "moudy",
    time: "14:04 UTC",
    text: "You're safe — I can see the tx confirmed on the source chain. The relayer is congested right now, so it may take ~30 more minutes. I'll keep this ticket open and update you the moment it lands.",
  },
  {
    from: "user",
    time: "14:05 UTC",
    text: "Phew, thank you for checking so fast 🙏",
  },
];

// Timeline: even steps = typing indicator, odd steps = message shown.
// Step 6 = resolved footer. Then pause and loop.
const STEP_DURATIONS = [1100, 1400, 1800, 1600, 1100, 1400, 4500];

export default function TicketDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((s) => (s + 1) % STEP_DURATIONS.length);
    }, STEP_DURATIONS[step]);
    return () => clearTimeout(timer);
  }, [step]);

  const visibleCount = Math.min(Math.floor((step + 1) / 2), messages.length);
  const typingFrom: "user" | "moudy" | null =
    step < 6 && step % 2 === 0 ? messages[step / 2].from : null;
  const resolved = step >= 6;

  return (
    <div className="w-full rounded-2xl border border-line bg-card p-5 shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          TKT-0147 · Priority: High
        </p>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider transition-colors duration-500 ${
            resolved
              ? "border-accent/30 bg-accent-soft text-accent"
              : "border-amber-400/30 bg-amber-400/10 text-amber-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              resolved ? "bg-accent" : "animate-pulse bg-amber-300"
            }`}
          />
          {resolved ? "Resolved" : "In Progress"}
        </span>
      </div>

      {/* Messages */}
      <div className="mt-4 flex min-h-[280px] flex-col gap-3">
        {messages.slice(0, visibleCount).map((msg, i) => (
          <div
            key={i}
            className={`animate-fade-up rounded-xl border p-3.5 text-sm leading-relaxed ${
              msg.from === "moudy"
                ? "ml-6 border-accent/20 bg-accent-soft"
                : "mr-6 border-line bg-background/60"
            }`}
          >
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
              {msg.from === "moudy" ? (
                <span className="text-accent">Moudy</span>
              ) : (
                "User"
              )}{" "}
              · {msg.time}
            </p>
            {msg.text}
          </div>
        ))}

        {typingFrom && (
          <div
            className={`flex w-fit items-center gap-1.5 rounded-xl border p-3.5 ${
              typingFrom === "moudy"
                ? "ml-6 self-end border-accent/20 bg-accent-soft"
                : "mr-6 border-line bg-background/60"
            }`}
          >
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
          </div>
        )}

        {resolved && (
          <p className="animate-fade-up mt-auto pt-2 text-center font-mono text-[11px] uppercase tracking-wider text-accent">
            ✓ Resolved in 6 min · CSAT ★★★★★
          </p>
        )}
      </div>
    </div>
  );
}
