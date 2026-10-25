import "./articles.css";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";
import { getPostTags, listPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Notes and writing about customer support, Web3 community, and the systems behind calm operations.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "Articles | Moudy",
    description:
      "Notes and writing about customer support, Web3 community, and the systems behind calm operations.",
    url: "/articles",
    type: "website",
  },
};

type Props = { searchParams: Promise<{ tag?: string | string[] }> };

export default async function ArticlesPage({ searchParams }: Props) {
  const allPosts = await listPublishedPosts();
  const requested = (await searchParams).tag;
  const tag = typeof requested === "string" ? requested.trim() : "";

  // Topics in order of how often they are used, then alphabetically.
  const counts = new Map<string, { label: string; count: number }>();
  for (const post of allPosts) {
    for (const label of getPostTags(post.tags)) {
      const key = label.toLowerCase();
      const entry = counts.get(key) ?? { label, count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    }
  }
  const topics = [...counts.entries()].sort(
    ([a, x], [b, y]) => y.count - x.count || a.localeCompare(b),
  );
  const activeTopic = counts.get(tag.toLowerCase());
  const posts = activeTopic
    ? allPosts.filter((post) =>
        getPostTags(post.tags).some((t) => t.toLowerCase() === tag.toLowerCase()),
      )
    : allPosts;
  const [featured, ...rest] = posts;

  return (
    <div className="public-site">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="writing-page">
          <header className="writing-hero animate-fade-up">
            <p className="writing-eyebrow">Writing</p>
            <h1>Articles</h1>
            <p className="writing-intro">
              Notes about Web3 support, community, and anything else I feel like
              writing about.
            </p>
            {topics.length > 0 && (
              <nav className="writing-topics" aria-label="Filter by topic">
                <Link
                  href="/articles"
                  aria-current={activeTopic ? undefined : "page"}
                >
                  All <span>{allPosts.length}</span>
                </Link>
                {topics.map(([key, { label, count }]) => (
                  <Link
                    key={key}
                    href={`/articles?tag=${encodeURIComponent(label)}`}
                    aria-current={activeTopic?.label === label ? "page" : undefined}
                  >
                    {label} <span>{count}</span>
                  </Link>
                ))}
              </nav>
            )}
          </header>

          {posts.length === 0 && (
            <div className="writing-empty">
              <p>No articles yet.</p>
              <p>New writing will show up here soon.</p>
            </div>
          )}

          {featured && (
            <Reveal>
              <ArticleCard post={featured} featured />
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="post-grid">
              {rest.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 60}>
                  <ArticleCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
