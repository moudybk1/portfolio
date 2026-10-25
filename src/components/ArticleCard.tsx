import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import ArticleCover from "@/components/ArticleCover";
import {
  formatPostDate,
  getPostTags,
  readingMinutes,
  type Post,
} from "@/lib/posts";

type Props = { post: Post; featured?: boolean };

export default function ArticleCard({ post, featured = false }: Props) {
  const tags = getPostTags(post.tags);
  return (
    <Link
      href={`/articles/${post.slug}`}
      className={featured ? "post-card post-card-featured" : "post-card"}
    >
      <div className="post-card-cover">
        <ArticleCover
          post={post}
          preload={featured}
          sizes={
            featured
              ? "(max-width: 899px) calc(100vw - 40px), 700px"
              : "(max-width: 767px) calc(100vw - 40px), (max-width: 1099px) 50vw, 400px"
          }
        />
      </div>
      <div className="post-card-body">
        <p className="post-meta">
          <time dateTime={post.created_at.replace(" ", "T") + "Z"}>
            {formatPostDate(post.created_at, featured ? "long" : "short")}
          </time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes(post.content)} min read</span>
        </p>
        <h2 className="post-card-title">{post.title}</h2>
        {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
        <div className="post-card-footer">
          {tags.length > 0 && (
            <ul className="post-tags" aria-label="Topics">
              {tags.slice(0, featured ? 4 : 2).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
          <span className="post-card-arrow" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
