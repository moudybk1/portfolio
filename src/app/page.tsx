import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TicketDemo from "@/components/TicketDemo";
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

export default function Home() {
  const posts = listPublishedPosts().slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="glow flex min-h-[calc(100svh-4rem)] items-center">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="animate-fade-up font-mono text-sm text-accent">
                Web3 Customer Support Specialist
              </p>
              <h1 className="animate-fade-up delay-100 mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Building Web3 support experiences that feel{" "}
                <span className="text-accent">human</span>.
              </h1>
              <p className="animate-fade-up delay-200 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                I help crypto communities and Web3 product teams support users
                with clarity, empathy, fast ticket triage, and well-organized
                support operations.
              </p>
              <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="#work"
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
                >
                  View Work
                </Link>
                <Link
                  href="#contact"
                  className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
                >
                  Contact Me
                </Link>
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
            <div>
              <p className="font-mono text-sm text-accent">About Me</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Support work that balances people, product, and process.
              </h2>
              <div className="mt-8 flex items-center gap-4">
                <Image
                  src="/me.png"
                  alt="Photo of Moudy"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-2xl border border-line object-cover"
                />
                <div>
                  <p className="font-medium">Moudy</p>
                  <p className="mt-0.5 text-sm text-muted">
                    Web3 Customer Support Specialist
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-5 leading-relaxed text-muted">
              <p>
                I work in Web3 customer support, helping users feel understood
                while keeping support operations tidy behind the scenes. I
                handle community questions, tickets, Discord and Telegram
                moderation context, and user education across fast-moving
                crypto spaces.
              </p>
              <p>
                My approach is calm and structured: listen carefully, give
                clear answers, document repeat issues, and escalate bugs or
                product feedback with context when something needs the product
                or engineering team.
              </p>
              <p>
                Outside daily support, I enjoy improving knowledge bases,
                writing better support macros, mapping user pain points, and
                making community channels feel safer without losing their
                human warmth.
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
              Web3 support toolkit.
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
            <p className="font-mono text-sm text-accent">Index</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Selected Web3 support work.
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
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Let&apos;s build something{" "}
              <span className="text-accent">calm</span> together.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
              Open to Web3 customer support, crypto community moderation, user
              education, and support operations opportunities.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="mailto:hello@moudy.xyz"
                className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                Say Hello
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
