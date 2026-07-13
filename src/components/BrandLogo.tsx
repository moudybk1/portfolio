import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  className?: string;
};

export default function BrandLogo({
  href,
  className = "inline-flex items-center font-mono text-base font-semibold tracking-tight sm:text-lg",
}: BrandLogoProps) {
  const content = (
    <>
      <span className="text-accent">~/</span>
      <span className="text-foreground">moudy</span>
      <span
        className="cursor-blink ml-1.5 inline-block h-[1.1em] w-[0.22em] translate-y-[0.06em] rounded-[1px] bg-accent shadow-[0_0_10px_rgba(52,211,153,0.85)]"
        aria-hidden="true"
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <p className={className}>{content}</p>;
}
