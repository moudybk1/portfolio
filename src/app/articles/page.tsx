import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostTags, listPublishedPosts } from "@/lib/posts";
import Reveal from "@/components/Reveal";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";

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

export default async function ArticlesPage() {
  const posts = await listPublishedPosts();

  return (
    <div className="public-site">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="articles-container">
          <div className="articles-header animate-fade-up">
            <p className="section-label">Writing</p>
            <h1>Articles</h1>
            <p>
              Notes about Web3 support, community, and anything else I feel like
              writing about.
            </p>
          </div>
          <div className="articles-list">
            {posts.length === 0 && (
              <p className="articles-empty">
                No articles yet. Check back soon.
              </p>
            )}
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 50}>
                <Link
                  href={`/articles/${post.slug}`}
                  className="article-preview"
                >
                  <div className="article-meta">
                    <span>
                      {new Date(post.created_at + "Z").toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </span>
                    {getPostTags(post.tags).map((tag) => (
                      <span key={tag} className="article-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2>
                    {post.title}
                    <ArrowUpRight size={23} aria-hidden="true" />
                  </h2>
                  {post.excerpt && (
                    <p className="article-excerpt">{post.excerpt}</p>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
