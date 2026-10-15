import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostBySlug, getPostTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const markdownComponents: Components = {
  pre: ({ children }) => <pre tabIndex={0}>{children}</pre>,
  table: ({ children }) => (
    <div
      className="article-table-scroll"
      tabIndex={0}
      role="region"
      aria-label="Article table"
    >
      <table>{children}</table>
    </div>
  ),
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) return { title: "Not Found" };

  const url = `/articles/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: new Date(post.created_at + "Z").toISOString(),
      modifiedTime: new Date(post.updated_at + "Z").toISOString(),
      authors: [siteConfig.name],
      images: [
        {
          url: siteConfig.ogImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: `@${siteConfig.twitter}`,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <div className="public-site">
      <Navbar />
      <main id="main-content" className="flex-1">
        <article className="article-container animate-fade-up">
          <Link href="/articles" className="text-link">
            ← All articles
          </Link>
          <div className="article-meta">
            <span>
              {new Date(post.created_at + "Z").toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {getPostTags(post.tags).map((tag) => (
              <span key={tag} className="article-tag">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="article-title">{post.title}</h1>
          <div className="prose article-prose max-w-none prose-headings:tracking-tight">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
