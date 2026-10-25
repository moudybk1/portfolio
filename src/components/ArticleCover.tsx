import Image from "next/image";
import { getPostTags, type Post } from "@/lib/posts";
import { parseMediaUrl } from "@/lib/media-url";

type Props = {
  post: Post;
  sizes: string;
  preload?: boolean;
};

// Cards crop their cover to the frame; articles without one get a quiet
// typographic tile instead of an empty box.
export default function ArticleCover({ post, sizes, preload }: Props) {
  if (parseMediaUrl(post.cover_image)) {
    return (
      <Image
        src={post.cover_image}
        alt=""
        fill
        sizes={sizes}
        preload={preload}
        className="post-cover-image"
      />
    );
  }
  if (post.cover_image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external URLs are not optimized
      <img src={post.cover_image} alt="" className="post-cover-image" />
    );
  }
  const topic = getPostTags(post.tags)[0];
  return (
    <div className="post-cover-fallback" aria-hidden="true">
      {topic && <span>{topic}</span>}
      <strong>{post.title.trim().charAt(0)}</strong>
    </div>
  );
}
