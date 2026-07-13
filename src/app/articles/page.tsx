import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listPublishedPosts } from "@/lib/posts";

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
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="font-mono text-sm text-accent">Writing</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Articles
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            Notes about Web3 support, community, and anything else I feel like
            writing about.
          </p>

          <div className="mt-12 space-y-4">
            {posts.length === 0 && (
              <p className="rounded-xl border border-line bg-card p-8 text-center text-muted">
                No articles yet. Check back soon.
              </p>
            )}
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group block rounded-xl border border-line bg-card p-6 transition-all hover:border-accent/40"
              >
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
                  <span>
                    {new Date(post.created_at + "Z").toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                  {post.tags &&
                    post.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent-soft px-2.5 py-0.5 text-accent"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
                <h2 className="mt-3 text-xl font-semibold leading-snug group-hover:text-accent">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
