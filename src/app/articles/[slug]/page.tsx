import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) return { title: "Not Found" };
  return {
    title: `${post.title} | Moudy`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-20">
          <Link
            href="/articles"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            ← All articles
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
            <span>
              {new Date(post.created_at + "Z").toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
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
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="prose prose-invert mt-10 max-w-none prose-headings:tracking-tight prose-a:text-accent prose-code:text-accent prose-pre:border prose-pre:border-line prose-pre:bg-card">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
