import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = listPublishedPosts();

  const articleEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/articles/${post.slug}`,
    lastModified: new Date(post.updated_at + "Z"),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articleEntries,
  ];
}
