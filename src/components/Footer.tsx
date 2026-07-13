import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} Moudy. Built with calm and clarity.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/articles" className="hover:text-foreground">
            Articles
          </Link>
          <Link href="/#contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
