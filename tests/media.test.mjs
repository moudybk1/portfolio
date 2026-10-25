import assert from "node:assert/strict";
import { after, test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { createLoader } from "./helpers/load-ts.mjs";

const directory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-media-test-"));
process.env.TURSO_DATABASE_URL = `file:${path.join(directory, "test.db")}`;
delete process.env.TURSO_AUTH_TOKEN;
const load = createLoader();
const media = load("src/lib/media.ts");
const posts = load("src/lib/posts.ts");
const { parseMediaUrl, isAllowedImageUrl } = load("src/lib/media-url.ts");
const { getDb } = load("src/lib/db.ts");
const closers = [];

after(async () => {
  (await getDb()).close();
  for (const close of closers) close();
  fs.rmSync(directory, { recursive: true, force: true });
});

const bytes = (...parts) =>
  new Uint8Array(parts.flatMap((part) =>
    typeof part === "string" ? [...part].map((c) => c.charCodeAt(0)) : part));
const png = bytes("\x89PNG\r\n\x1a\n", [0, 0, 0, 13]);

test("image types are read from the file bytes, not the name", () => {
  assert.equal(media.detectImageType(bytes([0xff, 0xd8, 0xff, 0xe0])), "image/jpeg");
  assert.equal(media.detectImageType(png), "image/png");
  assert.equal(media.detectImageType(bytes("GIF89a")), "image/gif");
  assert.equal(media.detectImageType(bytes("RIFF", [1, 2, 3, 4], "WEBPVP8 ")), "image/webp");
  assert.equal(media.detectImageType(bytes([0, 0, 0, 28], "ftypavif")), "image/avif");
  assert.equal(media.detectImageType(bytes('<svg xmlns="http://www.w3.org/2000/svg">')), undefined);
  assert.equal(media.detectImageType(bytes("<!doctype html><script>")), undefined);
});

test("a stored image comes back with its detected type", async () => {
  const url = await media.saveImage(png, 1600, 900);
  const parsed = parseMediaUrl(url);
  assert.deepEqual({ width: parsed.width, height: parsed.height }, { width: 1600, height: 900 });
  const image = await media.getImage(parsed.id);
  assert.equal(image.mime, "image/png");
  assert.deepEqual(new Uint8Array(image.data), png);
});

test("uploads that are not usable images are refused", async () => {
  await assert.rejects(media.saveImage(new Uint8Array(), 10, 10), /empty/);
  await assert.rejects(media.saveImage(bytes("<svg></svg>"), 10, 10), /JPEG, PNG/);
  await assert.rejects(media.saveImage(png, 0, 10), /size/);
  await assert.rejects(media.saveImage(png, 1.5, 10), /size/);
  const huge = new Uint8Array(media.MAX_IMAGE_BYTES + 1);
  huge.set(png);
  await assert.rejects(media.saveImage(huge, 10, 10), /3\.5 MB/);
});

test("unknown or malformed image IDs are simply missing", async () => {
  assert.equal(await media.getImage("0".repeat(32)), undefined);
  assert.equal(await media.getImage("../../etc/passwd"), undefined);
  assert.equal(await media.getImage("' OR 1=1 --"), undefined);
});

test("only uploaded images and https URLs are accepted as covers", () => {
  assert.equal(isAllowedImageUrl(`/media/${"a".repeat(32)}-1200x800`), true);
  assert.equal(isAllowedImageUrl("https://example.com/cover.jpg"), true);
  for (const url of [
    "javascript:alert(1)",
    "http://example.com/cover.jpg",
    "data:image/png;base64,AAAA",
    "/media/abc-1x1",
    "/etc/passwd",
    "",
  ]) {
    assert.equal(isAllowedImageUrl(url), false, url);
  }
});

test("a cover image is saved with a post and can be cleared", async () => {
  const input = { title: "Cover test", excerpt: "", content: "Body", tags: "", published: true };
  const withoutCover = await posts.createPost(input);
  assert.equal(withoutCover.cover_image, "");
  const cover = `/media/${"b".repeat(32)}-1200x800`;
  const updated = await posts.updatePost(withoutCover.id, { ...input, coverImage: cover });
  assert.equal(updated.cover_image, cover);
  const cleared = await posts.updatePost(withoutCover.id, { ...input, coverImage: "" });
  assert.equal(cleared.cover_image, "");
});

test("databases created before cover images gain the column", async () => {
  const legacyUrl = `file:${path.join(directory, "legacy.db")}`;
  const legacy = createClient({ url: legacyUrl });
  closers.push(() => legacy.close());
  await legacy.execute(`CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL, excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '',
    published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')))`);
  await legacy.execute("INSERT INTO posts (slug, title) VALUES ('old', 'Old post')");

  const previous = process.env.TURSO_DATABASE_URL;
  process.env.TURSO_DATABASE_URL = legacyUrl;
  const legacyLoad = createLoader();
  const legacyDb = await legacyLoad("src/lib/db.ts").getDb();
  process.env.TURSO_DATABASE_URL = previous;
  closers.push(() => legacyDb.close());

  const old = await legacyLoad("src/lib/posts.ts").getPostBySlug("old");
  assert.equal(old.title, "Old post");
  assert.equal(old.cover_image, "");
});

test("reading time counts words and ignores image markup", () => {
  assert.equal(posts.readingMinutes(""), 1);
  assert.equal(posts.readingMinutes("word ".repeat(1100)), 5);
  const image = `![A long description of a photo](/media/${"c".repeat(32)}-10x10 "Caption")`;
  assert.equal(posts.readingMinutes(`${image}\n\n${"word ".repeat(440)}`), 2);
});
