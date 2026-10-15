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

export function getPostTags(tags: string): string[] {
  return [...new Set(tags.split(",").map((tag) => tag.trim()).filter(Boolean))];
}

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
  if (!validPostId(id)) return undefined;
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

function validPostId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0;
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
  const stem = slugify(input.title) || "untitled";
  for (let suffix = 1; ; suffix += 1) {
    const slug = suffix === 1 ? stem : `${stem}-${suffix}`;
    // Let the unique constraint arbitrate concurrent submissions atomically.
    const result = await db.execute({
      sql: `INSERT INTO posts (slug, title, excerpt, content, tags, published)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(slug) DO NOTHING`,
      args: [
        slug,
        input.title,
        input.excerpt,
        input.content,
        input.tags,
        input.published ? 1 : 0,
      ],
    });
    if (result.rowsAffected === 0) continue;
    const post = await getPostById(Number(result.lastInsertRowid));
    return post!;
  }
}

export async function updatePost(
  id: number,
  input: PostInput
): Promise<Post | undefined> {
  if (!validPostId(id)) return undefined;
  const db = await getDb();
  // Keep existing links valid when an article's title changes.
  await db.execute({
    sql: `UPDATE posts
          SET title = ?, excerpt = ?, content = ?, tags = ?, published = ?,
              updated_at = datetime('now')
          WHERE id = ?`,
    args: [
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
  if (!validPostId(id)) return;
  const db = await getDb();
  await db.execute({ sql: "DELETE FROM posts WHERE id = ?", args: [id] });
}
