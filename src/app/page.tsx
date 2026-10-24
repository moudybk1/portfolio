import "./fullpage.css";
import "./sections.css";
import "./playground.css";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import TicketDemo from "@/components/TicketDemo";
import TypingRotate from "@/components/TypingRotate";
import SectionLink from "@/components/SectionLink";
import { listPublishedPosts } from "@/lib/posts";
import WorkShowcase from "@/components/WorkShowcase";
import FullPagePortfolio from "@/components/FullPagePortfolio";
import AboutReading from "@/components/AboutReading";
import AIPlayground from "@/components/AIPlayground";
import LatestArticles from "@/components/LatestArticles";
import {
  ArrowUpRight,
  EnvelopeSimple,
  Plus,
  TelegramLogo,
} from "@phosphor-icons/react/ssr";

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
  {
    name: "Pyth Data",
    description:
      "Community support for a decentralized price data network, helping users and builders find their way around the ecosystem.",
    tags: ["Oracle", "Community"],
  },
  {
    name: "AELF Chain",
    description:
      "Support and community handling for a multi-chain Layer 1 ecosystem, from wallet questions to network updates.",
    tags: ["Layer 1", "Community"],
  },
  {
    name: "ZTX",
    description:
      "Community support for a Web3 virtual world and creator platform, covering onboarding questions and user reports.",
    tags: ["Metaverse", "Community"],
  },
];

const contact = {
  email: "moudy.eth@gmail.com",
  telegram: "mowdylowdy",
};

const experienceArt = [
  {
    src: "/images/project-nansen-app.webp",
    position: "50% 85%",
  },
  {
    src: "/images/project-xai-riftstorm.webp",
    position: "50% 30%",
  },
  {
    src: "/images/project-nosana-workloads.webp",
    position: "50% 65%",
  },
  {
    src: "/images/experience-analytics.webp",
    position: "50% 50%",
  },
  {
    src: "/images/experience-infrastructure.webp",
    position: "50% 50%",
  },
  {
    src: "/images/experience-gaming.webp",
    position: "50% 50%",
  },
];

export default async function Home() {
  const posts = (await listPublishedPosts()).slice(0, 3);
  const chapters = [
    { id: "home", label: "Home" },
    { id: "work", label: "Work Experience" },
    { id: "about", label: "About Me" },
    { id: "approach", label: "Empathy" },
    { id: "toolkit", label: "Toolkit" },
    { id: "ai-playground", label: "AI Playground" },
    ...(posts.length > 0 ? [{ id: "writing", label: "Writing" }] : []),
    { id: "contact", label: "Contact" },
    { id: "connect", label: "Connect" },
  ];

  return (
    <FullPagePortfolio chapters={chapters}>
      <section
        id="home"
        className="deck-panel deck-home"
        aria-labelledby="home-title"
      >
        <div className="panel-scroll">
          <div className="panel-content deck-hero-layout">
            <div className="deck-hero-copy">
              <p className="deck-role">Customer Support Specialist</p>
              <h1 id="home-title" className="deck-hero-title">
                Great support isn&apos;t a cost. It&apos;s how you keep{" "}
                <span>people</span>.
              </h1>
              <p className="deck-hero-description">
                I help teams turn everyday support into loyalty, with empathy,
                speed, and operations that don&apos;t fall apart under pressure.
                Learned it the hard way in Web3, ready for any industry now.
              </p>
              <div className="deck-hero-actions">
                <SectionLink section="work" className="button button-primary">
                  View Work <ArrowUpRight size={20} aria-hidden="true" />
                </SectionLink>
                <SectionLink
                  section="contact"
                  className="button button-secondary"
                >
                  Contact Me <ArrowUpRight size={20} aria-hidden="true" />
                </SectionLink>
              </div>
              <Link href="/articles" className="text-link deck-writing-link">
                Read my writing →
              </Link>
            </div>
            <div className="deck-hero-ticket">
              <TicketDemo variant="hero" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="deck-panel deck-work"
        aria-labelledby="work-title"
      >
        <div className="panel-scroll">
          <div className="panel-content">
            <div className="deck-heading">
              <p className="deck-label">Work Experience</p>
              <h2 id="work-title">
                Teams I&apos;ve helped support their users.
              </h2>
            </div>
            <WorkShowcase
              projects={work.map((project, index) => ({
                ...project,
                art: experienceArt[index].src,
                artPosition: experienceArt[index].position,
              }))}
            />
          </div>
        </div>
      </section>

      <section
        id="about"
        className="deck-panel deck-about"
        aria-labelledby="about-title"
      >
        <div className="panel-scroll">
          <div className="panel-content">
            <div className="deck-about-layout">
              <div className="deck-about-photo">
                <Image
                  src="/about-photo.png"
                  alt="Photo of Moudy"
                  width={1024}
                  height={571}
                  sizes="(max-width: 767px) and (max-height: 560px) 25vw, (max-width: 374px) 266px, (max-width: 767px) 360px, (max-width: 1023px) 28vw, (max-width: 1439px) 44vw, 575px"
                />
              </div>
              <div className="deck-about-intro">
                <div className="deck-heading">
                  <p className="deck-label">About Me</p>
                  <h2 id="about-title">
                    Support work that balances people, product, and process.
                  </h2>
                </div>
                <AboutReading>
                  <p>
                    I help teams take care of their users while keeping support
                    operations tidy behind the scenes. Questions, tickets,
                    community management, user education. I make sure people feel
                    understood and nothing falls through the cracks. Most of this
                    was forged in Web3, one of the fastest moving and most
                    demanding support environments there is.
                  </p>
                  <p>
                    Beyond daily support, I like improving knowledge bases and
                    mapping the pain points users keep running into. Outside of
                    work, you&apos;ll usually find me deep diving into AI, writing
                    simple research pieces to make sense of what I learn, or
                    simply spending slow afternoons with my cat, who is very much
                    the boss around here.
                  </p>
                </AboutReading>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="approach"
        className="deck-panel deck-approach"
        aria-label="Support approach"
      >
        <div className="panel-scroll">
          <div className="panel-content deck-approach-layout">
            <p className="deck-approach-copy">
              My approach is calm and structured: listen carefully, give clear
              answers, document recurring issues, and escalate bugs or product
              feedback with real context when something needs the product or
              engineering team.
            </p>
            <div className="principles-accordion">
              {values.map((value, index) => (
                <details
                  key={value.title}
                  name="support-principles"
                  open={index === 0}
                  className="principle"
                >
                  <summary>
                    <h3>{value.title}</h3>
                    <Plus size={22} aria-hidden="true" />
                  </summary>
                  <p>{value.body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="toolkit"
        className="deck-panel deck-toolkit"
        aria-labelledby="toolkit-title"
      >
        <div className="panel-scroll">
          <div className="panel-content deck-toolkit-layout">
            <div className="deck-heading">
              <p className="deck-label">Toolkit</p>
              <h2 id="toolkit-title">Support toolkit.</h2>
            </div>
            <div className="deck-tools">
              {toolkit.map((tool) => (
                <div key={tool.name} className="deck-tool">
                  <span className="tool-logo">
                    <Image
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      width={42}
                      height={42}
                      className="object-contain"
                    />
                  </span>
                  <div>
                    <h3>{tool.name}</h3>
                    <p>{tool.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AIPlayground />

      {posts.length > 0 && (
        <section
          id="writing"
          className="deck-panel deck-writing"
          aria-labelledby="writing-title"
        >
          <div className="panel-scroll">
            <div className="panel-content">
              <div className="deck-heading deck-writing-heading">
                <div>
                  <p className="deck-label">Writing</p>
                  <h2 id="writing-title">Latest articles.</h2>
                </div>
                <Link href="/articles" className="text-link">
                  View all →
                </Link>
              </div>
              <LatestArticles>
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/articles/${post.slug}`}
                    className="article-preview"
                  >
                    <p className="article-date">
                      {new Date(post.created_at + "Z").toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </p>
                    <div>
                      <h3>{post.title}</h3>
                      <p className="article-excerpt">{post.excerpt}</p>
                    </div>
                    <span className="article-arrow">
                      <ArrowUpRight size={28} aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </LatestArticles>
            </div>
          </div>
        </section>
      )}

      <section
        id="contact"
        className="deck-panel deck-contact"
        aria-labelledby="contact-title"
      >
        <div className="panel-scroll">
          <div className="panel-content deck-contact-layout">
            <div className="contact-copy">
              <h2
                id="contact-title"
                className="contact-title"
                aria-label="Let's build something calm together."
              >
                Let&apos;s build something{" "}
                <span className="contact-title-ending">
                  <TypingRotate /> together.
                </span>
              </h2>
              <p>
                Open to support, community, and operations roles, in Web3 or
                anywhere users need someone who genuinely cares. Reach me via
                email or Telegram, whichever&apos;s easier for you.
              </p>
            </div>
            <div className="contact-actions">
              <a href={`mailto:${contact.email}`} className="contact-link">
                <EnvelopeSimple size={26} aria-hidden="true" />
                <span>Email</span>
                <span className="contact-arrow">
                  <ArrowUpRight size={26} aria-hidden="true" />
                </span>
              </a>
              <a
                href={`https://t.me/${contact.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <TelegramLogo size={26} aria-hidden="true" />
                <span>Telegram</span>
                <span className="contact-arrow">
                  <ArrowUpRight size={26} aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="connect"
        className="deck-panel deck-connect"
        aria-label="Connect"
      >
        <div className="panel-scroll">
          <div className="panel-content">
            <Footer />
          </div>
        </div>
      </section>
    </FullPagePortfolio>
  );
}
