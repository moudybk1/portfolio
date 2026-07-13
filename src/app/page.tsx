import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TicketDemo from "@/components/TicketDemo";
import TypingRotate from "@/components/TypingRotate";
import SectionLink from "@/components/SectionLink";
import HomeScrollHandler from "@/components/HomeScrollHandler";
import { listPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const values = [
  {
    title: "Empathy",
    body: "Users get answers that feel human and reassuring, not canned replies.",
  },
  {
    title: "Accuracy",
    body: "Teams get clean context, fewer repeats, and better visibility into issues.",
  },
  {
    title: "Calm Triage",
    body: "Prioritizing tickets, questions, and community reports without making users feel rushed.",
  },
  {
    title: "Clear Systems",
    body: "Turning repeated issues into clean macros, docs, escalation notes, and knowledge flows.",
  },
];

const toolkit = [
  { name: "Discord", role: "Community", logo: "/logos/tools/discord.svg" },
  { name: "Telegram", role: "Community", logo: "/logos/tools/telegram.svg" },
  { name: "Zendesk", role: "Ticketing", logo: "/logos/tools/zendesk.svg" },
  { name: "Intercom", role: "Support", logo: "/logos/tools/intercom.svg" },
  { name: "Mava", role: "Web3 Support", logo: "/logos/tools/mava.png" },
  { name: "Notion", role: "Documentation", logo: "/logos/tools/notion.svg" },
  { name: "Slack", role: "Teamwork", logo: "/logos/tools/slack.svg" },
  { name: "Sheets", role: "Operations", logo: "/logos/tools/sheets.svg" },
];

const work = [
  {
    name: "Nansen AI",
    logo: "/logos/nansen.png",
    description:
      "Web3 analytics support, user education, and community question handling.",
    tags: ["Analytics", "User Support"],
  },
  {
    name: "XAI Games",
    logo: "/logos/xai.png",
    description:
      "Community support for gaming users, onboarding questions, and ticket hygiene.",
    tags: ["Gaming", "Community"],
  },
  {
    name: "Nosana",
    logo: "/logos/nosana.png",
    description:
      "Support for decentralized infrastructure users across social and help channels.",
    tags: ["DePIN", "Support Ops"],
  },
];

const contact = {
  email: "moudy.eth@gmail.com",
  telegram: "mowdylowdy",
};

export default async function Home() {
  const posts = (await listPublishedPosts()).slice(0, 3);

  return (
    <>
      <HomeScrollHandler />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="glow flex min-h-[calc(100svh-4rem)] items-center">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="animate-fade-up font-mono text-sm text-accent">
                Customer Support Specialist
              </p>
              <h1 className="animate-fade-up delay-100 mt-4 max-w-xl text-4xl font-semibold leading-[1.15] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                <span className="block text-foreground/70">
                  Great support isn&apos;t a cost.
                </span>
                <span className="mt-1 block sm:mt-2">
                  It&apos;s how you keep{" "}
                  <span className="text-accent">people</span>.
                </span>
              </h1>
              <p className="animate-fade-up delay-200 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                I help teams turn everyday support into loyalty, with empathy,
                speed, and operations that don&apos;t fall apart under pressure.
                Learned it the hard way in Web3, ready for any industry now.
              </p>
              <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center gap-4">
                <SectionLink
                  section="work"
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
                >
                  View Work
                </SectionLink>
                <SectionLink
                  section="contact"
                  className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
                >
                  Contact Me
                </SectionLink>
                <Link
                  href="/articles"
                  className="px-2 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
                >
                  Read my writing →
                </Link>
              </div>
            </div>
            <div className="animate-fade-up delay-200 mx-auto w-full max-w-lg lg:max-w-none">
              <TicketDemo />
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-line scroll-mt-16">
          <div className="mx-auto grid max-w-5xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col">
              <p className="font-mono text-sm text-accent">About Me</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Support work that balances people, product, and process.
              </h2>
              <div className="group relative mt-8 min-h-48 flex-1 overflow-hidden rounded-2xl border border-line">
                <Image
                  src="/about-photo.png"
                  alt="Photo of Moudy"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover object-top grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                />
              </div>
            </div>
            <div className="space-y-5 leading-relaxed text-muted">
              <p>
                I help teams take care of their users while keeping support
                operations tidy behind the scenes. Questions, tickets, community
                management, user education. I make sure people feel understood
                and nothing falls through the cracks. Most of this was forged in
                Web3, one of the fastest moving and most demanding support
                environments there is.
              </p>
              <p>
                My approach is calm and structured: listen carefully, give clear
                answers, document recurring issues, and escalate bugs or product
                feedback with real context when something needs the product or
                engineering team.
              </p>
              <p>
                Beyond daily support, I like improving knowledge bases and
                mapping the pain points users keep running into. Outside of
                work, you&apos;ll usually find me deep diving into AI, writing
                simple research pieces to make sense of what I learn, or simply
                spending slow afternoons with my cat, who is very much the boss
                around here.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl px-6 pb-24">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-xl border border-line bg-card p-5 transition-colors hover:border-accent/40"
                >
                  <h3 className="font-medium text-accent">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Toolkit */}
        <section id="toolkit" className="border-t border-line scroll-mt-16">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <p className="font-mono text-sm text-accent">Toolkit</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Support toolkit.
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {toolkit.map((tool) => (
                <div
                  key={tool.name}
                  className="group flex flex-col items-center rounded-xl border border-line bg-card p-5 text-center transition-colors hover:border-accent/40"
                >
                  <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-line bg-background/60 p-3 transition-transform group-hover:scale-105">
                    <Image
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  </span>
                  <p className="mt-3 font-medium">{tool.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                    {tool.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="border-t border-line scroll-mt-16">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <p className="font-mono text-sm text-accent">Work Experience</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Teams I&apos;ve helped support their users.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {work.map((project) => (
                <div
                  key={project.name}
                  className="group flex flex-col rounded-xl border border-line bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-background/60 p-2">
                      <Image
                        src={project.logo}
                        alt={`${project.name} logo`}
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                      />
                    </span>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest articles */}
        {posts.length > 0 && (
          <section className="border-t border-line">
            <div className="mx-auto max-w-5xl px-6 py-24">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono text-sm text-accent">Writing</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                    Latest articles.
                  </h2>
                </div>
                <Link
                  href="/articles"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  View all →
                </Link>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/articles/${post.slug}`}
                    className="group rounded-xl border border-line bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40"
                  >
                    <p className="font-mono text-xs text-muted">
                      {new Date(post.created_at + "Z").toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </p>
                    <h3 className="mt-3 font-semibold leading-snug group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact */}
        <section id="contact" className="border-t border-line scroll-mt-16">
          <div className="glow-soft mx-auto max-w-5xl px-6 py-28 text-center">
            <h2 className="mx-auto max-w-3xl text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Let&apos;s build something <TypingRotate /> together.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
              Open to support, community, and operations roles, in Web3 or
              anywhere users need someone who genuinely cares. Reach me via
              email or Telegram, whichever&apos;s easier for you.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Email
              </a>
              <a
                href={`https://t.me/${contact.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Telegram
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
