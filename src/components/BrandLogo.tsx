import Link from "next/link";
import { useId, type ComponentProps } from "react";

// The moudy mark (brand kit v1.0): a Coral arch for the user's voice and a
// Violet arch for the reply, sharing one stem. The stem takes currentColor so
// it reads as Paper on dark and Ink on light.
const ARCH_A =
  "M18 98 V56 A24 24 0 0 1 66 56 V98 H52 V56 A10 10 0 0 0 32 56 V98 Z";
const ARCH_B =
  "M52 98 V56 A24 24 0 0 1 100 56 V98 H86 V56 A10 10 0 0 0 66 56 V98 Z";

function MoudyMark() {
  const clip = useId();
  return (
    <svg
      viewBox="18 32 82 66"
      style={{ height: "0.53em", width: "auto", flexShrink: 0 }}
    >
      <defs>
        <clipPath id={clip}>
          <path d={ARCH_A} />
        </clipPath>
      </defs>
      <path d={ARCH_A} fill="#FF6B4A" />
      <path d={ARCH_B} fill="#7C6CFF" />
      <path d={ARCH_B} fill="currentColor" clipPath={`url(#${clip})`} />
    </svg>
  );
}

type BrandLogoProps = {
  href?: string;
  className?: string;
  onClick?: ComponentProps<typeof Link>["onClick"];
};

export default function BrandLogo({
  href,
  className = "inline-flex items-center text-lg text-foreground sm:text-xl",
  onClick,
}: BrandLogoProps) {
  // Wordmark lockup: the mark stands in for the "m", sitting on the baseline
  // at x-height. Assistive tech reads the full name instead.
  const content = (
    <>
      <span className="sr-only">moudy</span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: "0.04em",
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.035em",
          lineHeight: 1,
        }}
      >
        <MoudyMark />
        <span>oudy</span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return <p className={className}>{content}</p>;
}
