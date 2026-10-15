import Link from "next/link";
import type { ComponentProps } from "react";

type BrandLogoProps = {
  href?: string;
  className?: string;
  onClick?: ComponentProps<typeof Link>["onClick"];
};

export default function BrandLogo({
  href,
  className = "inline-flex items-center font-mono text-base font-semibold tracking-tight sm:text-lg",
  onClick,
}: BrandLogoProps) {
  const content = (
    <>
      <span className="text-accent">~/</span>
      <span className="text-foreground">moudy</span>
      <span
        className="cursor-blink ml-1.5 inline-block h-[1.1em] w-[0.22em] translate-y-[0.06em] rounded-[1px] bg-accent"
        aria-hidden="true"
      />
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
