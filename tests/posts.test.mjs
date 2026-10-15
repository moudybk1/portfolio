import assert from "node:assert/strict";
import { after, test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createLoader } from "./helpers/load-ts.mjs";

const directory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-posts-test-"));
process.env.TURSO_DATABASE_URL = `file:${path.join(directory, "test.db")}`;
delete process.env.TURSO_AUTH_TOKEN;
const load = createLoader();
const posts = load("src/lib/posts.ts");
const { getDb } = load("src/lib/db.ts");
const input = (title, published = false) => ({
  title, published, excerpt: "Test excerpt", content: "## Test body", tags: "test",
});

after(async () => {
  (await getDb()).close();
  fs.rmSync(directory, { recursive: true, force: true });
});

test("identical titles get distinct readable URLs", async () => {
  const first = await posts.createPost(input("Repeated title"));
  const second = await posts.createPost(input("Repeated title"));
  assert.equal(first.slug, "repeated-title");
  assert.equal(second.slug, "repeated-title-2");
});

test("simultaneous submissions with the same title both get unique URLs", async () => {
  const created = await Promise.all([
    posts.createPost(input("Concurrent title")),
    posts.createPost(input("Concurrent title")),
  ]);
  assert.deepEqual(created.map(post => post.slug).sort(), [
    "concurrent-title", "concurrent-title-2",
  ]);
});

test("article tags ignore blanks and repeats while preserving label order", () => {
  assert.deepEqual(posts.getPostTags("support,support, web3, ,"), ["support", "web3"]);
  assert.deepEqual(posts.getPostTags("  ,  "), []);
});

test("non-Latin titles retain a readable fallback when repeated", async () => {
  const first = await posts.createPost(input("你好"));
  const second = await posts.createPost(input("こんにちは"));
  assert.equal(first.slug, "untitled");
  assert.equal(second.slug, "untitled-2");
});

test("editing a published title preserves its existing URL", async () => {
  const original = await posts.createPost(input("Published before editing", true));
  const updated = await posts.updatePost(original.id, input("A corrected title", true));
  assert.equal(updated.slug, original.slug);
  assert.equal((await posts.getPostBySlug(original.slug)).title, "A corrected title");
});

test("published lists exclude drafts and reflect publish changes", async () => {
  const draft = await posts.createPost(input("Private draft"));
  assert.equal((await posts.listPublishedPosts()).some(p => p.id === draft.id), false);
  await posts.updatePost(draft.id, input("Private draft", true));
  assert.equal((await posts.listPublishedPosts()).some(p => p.id === draft.id), true);
});

test("invalid IDs are treated as missing posts without database exceptions", async () => {
  for (const id of [NaN, Infinity, -1, 0, 1.5]) {
    assert.equal(await posts.getPostById(id), undefined);
    assert.equal(await posts.updatePost(id, input("Invalid ID")), undefined);
    await posts.deletePost(id);
  }
});

test("deleting a post removes it from lookups and published lists", async () => {
  const post = await posts.createPost(input("Disposable regression fixture", true));
  await posts.deletePost(post.id);
  assert.equal(await posts.getPostById(post.id), undefined);
  assert.equal(await posts.getPostBySlug(post.slug), undefined);
  assert.equal((await posts.listPublishedPosts()).some(p => p.id === post.id), false);
});
