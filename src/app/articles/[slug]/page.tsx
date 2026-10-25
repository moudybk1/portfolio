import "../articles.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/ssr";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleBody from "@/components/ArticleBody";
import ArticleCard from "@/components/ArticleCard";
import SectionLink from "@/components/SectionLink";
import {
  formatPostDate,
  getPostBySlug,
  getPostTags,
  listPublishedPosts,
  readingMinutes,
} from "@/lib/posts";
import { parseMediaUrl } from "@/lib/media-url";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) return { title: "Not Found" };

  const url = `/articles/${post.slug}`;
  const image = post.cover_image || siteConfig.ogImage;

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
      tags: getPostTags(post.tags),
      images: [
        {
          url: image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: `@${siteConfig.twitter}`,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const tags = getPostTags(post.tags);
  const cover = parseMediaUrl(post.cover_image);
  const more = (await listPublishedPosts())
    .filter((other) => other.id !== post.id)
    .slice(0, 2);

  return (
    <div className="public-site">
      <Navbar />
      <main id="main-content" className="flex-1">
        <article className="post">
          <header className="post-header animate-fade-up">
            <Link href="/articles" className="post-back">
              <ArrowLeft size={16} aria-hidden="true" />
              All articles
            </Link>
            <p className="post-meta">
              <time dateTime={post.created_at.replace(" ", "T") + "Z"}>
                {formatPostDate(post.created_at)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{readingMinutes(post.content)} min read</span>
            </p>
            <h1 className="post-title">{post.title}</h1>
            {post.excerpt && <p className="post-lede">{post.excerpt}</p>}
            {tags.length > 0 && (
              <ul className="post-tags" aria-label="Topics">
                {tags.map((tag) => (
                  <li key={tag}>
                    <Link href={`/articles?tag=${encodeURIComponent(tag)}`}>
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </header>

          {post.cover_image && (
            <figure className="post-hero animate-fade-up">
              {cover ? (
                <Image
                  src={post.cover_image}
                  alt=""
                  width={cover.width}
                  height={cover.height}
                  sizes="(max-width: 1119px) calc(100vw - 40px), 1040px"
                  preload
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- external URLs are not optimized
                <img src={post.cover_image} alt="" />
              )}
            </figure>
          )}

          <ArticleBody content={post.content} />

          <footer className="post-footer">
            <div className="post-author">
              <Image
                src="/images/moudy-portrait.webp"
                alt=""
                width={56}
                height={56}
              />
              <div>
                <p>Written by {siteConfig.name}</p>
                <p>
                  Customer support specialist. Notes from the front line of
                  Web3 support and community work.
                </p>
              </div>
              <SectionLink section="contact" className="post-author-link">
                Get in touch
                <ArrowUpRight size={16} aria-hidden="true" />
              </SectionLink>
            </div>
          </footer>
        </article>

        {more.length > 0 && (
          <section className="post-more" aria-labelledby="more-articles">
            <div className="post-more-heading">
              <h2 id="more-articles">Keep reading</h2>
              <Link href="/articles" className="text-link">
                All articles →
              </Link>
            </div>
            <div className="post-grid">
              {more.map((other) => (
                <ArticleCard key={other.id} post={other} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
