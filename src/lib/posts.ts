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

function toPost(row: Record<string, unknown>): Post {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    tags: String(row.tags ?? ""),
    published: Number(row.published),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function listPublishedPosts(): Promise<Post[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC"
  );
  return result.rows.map(toPost);
}

export async function listAllPosts(): Promise<Post[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
  return result.rows.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT * FROM posts WHERE slug = ?",
    args: [slug],
  });
  return result.rows[0] ? toPost(result.rows[0]) : undefined;
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT * FROM posts WHERE id = ?",
    args: [id],
  });
  return result.rows[0] ? toPost(result.rows[0]) : undefined;
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

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const db = await getDb();
  let slug = base || "untitled";
  let n = 2;
  while (true) {
    const result = await db.execute({
      sql: "SELECT id FROM posts WHERE slug = ?",
      args: [slug],
    });
    const row = result.rows[0];
    if (!row || Number(row.id) === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}

export type PostInput = {
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  published: boolean;
};

export async function createPost(input: PostInput): Promise<Post> {
  const db = await getDb();
  const slug = await uniqueSlug(slugify(input.title));
  const result = await db.execute({
    sql: `INSERT INTO posts (slug, title, excerpt, content, tags, published)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      slug,
      input.title,
      input.excerpt,
      input.content,
      input.tags,
      input.published ? 1 : 0,
    ],
  });
  const post = await getPostById(Number(result.lastInsertRowid));
  return post!;
}

export async function updatePost(
  id: number,
  input: PostInput
): Promise<Post | undefined> {
  const db = await getDb();
  const slug = await uniqueSlug(slugify(input.title), id);
  await db.execute({
    sql: `UPDATE posts
          SET slug = ?, title = ?, excerpt = ?, content = ?, tags = ?, published = ?,
              updated_at = datetime('now')
          WHERE id = ?`,
    args: [
      slug,
      input.title,
      input.excerpt,
      input.content,
      input.tags,
      input.published ? 1 : 0,
      id,
    ],
  });
  return getPostById(id);
}

export async function deletePost(id: number): Promise<void> {
  const db = await getDb();
  await db.execute({ sql: "DELETE FROM posts WHERE id = ?", args: [id] });
}
