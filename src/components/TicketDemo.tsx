"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import { useReducedMotion } from "@/components/useReducedMotion";
import { usePanelVisibility } from "@/components/usePanelVisibility";
import "./TicketDemo.css";

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

// Hold the reply long enough to read, then fade out before starting a new cycle.
const STEP_DURATIONS = [0, 2700, 900, 4300, 2100, 2000, 3300, 760];
const compactQuery = "(max-width: 767px), (max-height: 560px)";

function subscribeCompact(onChange: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export default function TicketDemo({
  variant = "standard",
}: {
  variant?: "standard" | "hero";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [cycle, setCycle] = useState(0);
  const inView = usePanelVisibility(ref);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const mobile = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia(compactQuery).matches,
    () => false,
  );
  const compact = variant === "hero" && mobile;
  const [preview, setPreview] = useState<{
    step: number;
    index: number;
  } | null>(null);

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const timer = setTimeout(() => {
      if (step === 7) {
        setStep(1);
        setCycle((current) => current + 1);
        setPreview(null);
      } else setStep((current) => current + 1);
    }, STEP_DURATIONS[step]);
    return () => clearTimeout(timer);
  }, [step, reduce, paused, inView]);

  const resolved = reduce || step >= 6;
  const closing = !reduce && step === 7;
  const visibleCount = reduce
    ? messages.length
    : Math.min(Math.floor((step + 1) / 2), messages.length);
  const currentMessage = Math.min(
    preview?.step === step
      ? preview.index
      : reduce && compact
        ? 1
        : visibleCount - 1,
    visibleCount - 1,
  );

  function viewMessage(index: number) {
    setPreview({ step, index });
    setPaused(true);
  }

  return (
    <div
      ref={ref}
      className="ticket-demo"
      data-variant={variant}
      data-step={step}
      data-cycle={cycle}
      data-cycle-phase={closing ? "closing" : "playing"}
    >
      <div className="ticket-header">
        <p className="ticket-reference">TKT-0147 · Priority: High</p>
        <span className="ticket-state" aria-live="off">
          <span key={resolved ? "resolved" : "progress"}>
            {resolved ? "Resolved" : "In Progress"}
          </span>
        </span>
      </div>
      <div className="ticket-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`ticket-message ticket-message-${message.from}`}
            data-visible={!closing && index < visibleCount}
            data-current={index === currentMessage}
            data-past={index < currentMessage}
            aria-hidden={
              closing ||
              index >= visibleCount ||
              (compact && index !== currentMessage)
            }
          >
            <p className="ticket-sender">
              {message.from === "moudy" ? "Moudy" : "User"} · {message.time}
            </p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="ticket-bottom">
        {variant === "hero" && (
          <div
            className="ticket-history-controls"
            role="group"
            aria-label="Ticket messages"
          >
            <button
              type="button"
              aria-label="Previous ticket message"
              disabled={closing || currentMessage === 0}
              onClick={() => viewMessage(currentMessage - 1)}
            >
              <CaretLeft size={13} aria-hidden="true" />
            </button>
            <span aria-hidden="true">
              {String(currentMessage + 1).padStart(2, "0")} /{" "}
              {String(visibleCount).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Next ticket message"
              disabled={closing || currentMessage === visibleCount - 1}
              onClick={() => viewMessage(currentMessage + 1)}
            >
              <CaretRight size={13} aria-hidden="true" />
            </button>
          </div>
        )}
        <p
          className="ticket-result"
          data-visible={resolved && !closing}
          aria-hidden={!resolved || closing}
        >
          ✓ Resolved in 6 min · CSAT ★★★★★
        </p>
        {!reduce && (
          <button
            type="button"
            className="animation-control"
            aria-label={
              paused ? "Play ticket animation" : "Pause ticket animation"
            }
            onClick={() => {
              if (closing) {
                setStep(6);
                setPaused(true);
              } else {
                if (paused) setPreview(null);
                setPaused((value) => !value);
              }
            }}
          >
            {paused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
