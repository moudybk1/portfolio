import { getDb } from "./db";

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string; // comma-separated
  published: number;
  created_at: string;
  updated_at: string;
};

export function listPublishedPosts(): Post[] {
  return getDb()
    .prepare("SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC")
    .all() as Post[];
}

export function listAllPosts(): Post[] {
  return getDb()
    .prepare("SELECT * FROM posts ORDER BY created_at DESC")
    .all() as Post[];
}

export function getPostBySlug(slug: string): Post | undefined {
  return getDb().prepare("SELECT * FROM posts WHERE slug = ?").get(slug) as
    | Post
    | undefined;
}

export function getPostById(id: number): Post | undefined {
  return getDb().prepare("SELECT * FROM posts WHERE id = ?").get(id) as
    | Post
    | undefined;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueSlug(base: string, excludeId?: number): string {
  const db = getDb();
  let slug = base || "untitled";
  let n = 2;
  while (true) {
    const row = db
      .prepare("SELECT id FROM posts WHERE slug = ?")
      .get(slug) as { id: number } | undefined;
    if (!row || row.id === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}

export function createPost(input: {
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  published: boolean;
}): Post {
  const slug = uniqueSlug(slugify(input.title));
  const result = getDb()
    .prepare(
      `INSERT INTO posts (slug, title, excerpt, content, tags, published)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      slug,
      input.title,
      input.excerpt,
      input.content,
      input.tags,
      input.published ? 1 : 0
    );
  return getPostById(Number(result.lastInsertRowid))!;
}

export function updatePost(
  id: number,
  input: {
    title: string;
    excerpt: string;
    content: string;
    tags: string;
    published: boolean;
  }
): Post | undefined {
  const slug = uniqueSlug(slugify(input.title), id);
  getDb()
    .prepare(
      `UPDATE posts
       SET slug = ?, title = ?, excerpt = ?, content = ?, tags = ?, published = ?,
           updated_at = datetime('now')
       WHERE id = ?`
    )
    .run(
      slug,
      input.title,
      input.excerpt,
      input.content,
      input.tags,
      input.published ? 1 : 0,
      id
    );
  return getPostById(id);
}

export function deletePost(id: number): void {
  getDb().prepare("DELETE FROM posts WHERE id = ?").run(id);
}
