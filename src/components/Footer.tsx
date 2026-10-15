import Link from "next/link";
import {
  ArrowUpRight,
  DiscordLogo,
  LinkedinLogo,
  TelegramLogo,
  XLogo,
} from "@phosphor-icons/react/ssr";
import BrandLogo from "@/components/BrandLogo";
import SectionLink from "@/components/SectionLink";
import styles from "./Footer.module.css";

const navLinks = [
  { section: "home", label: "Home" },
  { section: "about", label: "About" },
  { section: "ai-playground", label: "AI Playground" },
  { href: "/articles", label: "Articles" },
  { section: "contact", label: "Contact" },
] as const;

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yogabk/",
    icon: LinkedinLogo,
  },
  { label: "Twitter", href: "https://x.com/mowdylowdy", icon: XLogo },
  { label: "Telegram", href: "https://t.me/mowdylowdy", icon: TelegramLogo },
  {
    label: "Discord",
    href: "https://discord.com/users/490201818123730954",
    icon: DiscordLogo,
  },
];

export default function Footer() {
  return (
    <footer className={`${styles.footer} portfolio-footer`}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand} data-footer-brand>
            <BrandLogo className={styles.wordmark} />
            <p className={styles.description}>
              Customer Support / Community Moderator / Community Management /
              Clear Operations
            </p>
          </div>
          <nav className={styles.navigation} aria-label="Footer navigation">
            <p className={styles.label} data-footer-label>Navigation</p>
            <ul className={styles.links} data-footer-links>
              {navLinks.map((link) => (
                <li key={link.label}>
                  {"section" in link ? (
                    <SectionLink section={link.section}>
                      {link.label}
                    </SectionLink>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <nav className={styles.connect} aria-label="Social profiles">
            <p className={styles.label} data-footer-label>Connect</p>
            <ul className={`${styles.links} ${styles.socials}`} data-footer-links>
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.socialIcon}>
                      <social.icon
                        size={17}
                        weight="regular"
                        aria-hidden="true"
                      />
                    </span>
                    <span>{social.label}</span>
                    <ArrowUpRight
                      className={styles.socialArrow}
                      size={14}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={styles.bottom} data-footer-bottom>
          © {new Date().getFullYear()} Moudy. Built with calm and clarity.
        </p>
      </div>
    </footer>
  );
}
