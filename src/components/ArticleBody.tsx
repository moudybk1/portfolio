import Image from "next/image";
import { Source_Serif_4 } from "next/font/google";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ElementContent } from "hast";
import { parseMediaUrl } from "@/lib/media-url";
import { splitParagraphs } from "@/lib/markdown";

// A book face for long reading; headings and UI keep the site's sans.
const serif = Source_Serif_4({
  variable: "--font-reading",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const isImage = (child: ElementContent) =>
  child.type === "element" && child.tagName === "img";
const isBlank = (child: ElementContent) =>
  child.type === "text" && !child.value.trim();

const components: Components = {
  // Images render as figures, which may not sit inside a <p>.
  p: ({ node, children }) => {
    const content = node?.children.filter((child) => !isBlank(child)) ?? [];
    if (content.length > 0 && content.every(isImage)) return <>{children}</>;
    if (content.some(isImage)) return <div className="article-p">{children}</div>;
    return <p>{children}</p>;
  },
  // ![Alt text](url "Optional caption")
  img: ({ src, alt, title }) => {
    if (typeof src !== "string" || !src) return null;
    const media = parseMediaUrl(src);
    return (
      <figure className="article-figure">
        {media ? (
          <Image
            src={src}
            alt={alt ?? ""}
            width={media.width}
            height={media.height}
            sizes="(max-width: 767px) calc(100vw - 40px), 840px"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- external URLs are not optimized
          <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
        )}
        {title && <figcaption>{title}</figcaption>}
      </figure>
    );
  },
  a: ({ href, children }) =>
    href?.startsWith("http") ? (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    ),
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

export default function ArticleBody({ content }: { content: string }) {
  return (
    <div className={`article-body ${serif.variable}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {splitParagraphs(content)}
      </ReactMarkdown>
    </div>
  );
}
