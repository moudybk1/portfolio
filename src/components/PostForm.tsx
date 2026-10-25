"use client";

import "@/app/articles/articles.css";
import {
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
} from "react";
import ArticleBody from "@/components/ArticleBody";
import type { Post } from "@/lib/posts";
import { uploadImageAction } from "@/app/admin/actions";
import { prepareImage } from "@/lib/prepare-image";

type Props = {
  post?: Post;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

const field =
  "w-full rounded-lg border border-line bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent";
const quietButton =
  "rounded-lg border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-50";

async function uploadImage(file: File): Promise<string> {
  const { blob, width, height } = await prepareImage(file);
  const data = new FormData();
  data.set("file", blob, "image");
  data.set("width", String(width));
  data.set("height", String(height));
  const result = await uploadImageAction(data);
  if ("error" in result) throw new Error(result.error);
  return result.url;
}

// "team-call_2.png" becomes "team call 2"; generic names give an empty alt.
function altFromName(file: File): string {
  const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return /^(image|img|screenshot|untitled)?\s*\d*$/i.test(name) ? "" : name;
}

const imagesIn = (files: FileList | null | undefined) =>
  [...(files ?? [])].filter((file) => file.type.startsWith("image/"));

export default function PostForm({ post, action, submitLabel }: Props) {
  const [content, setContent] = useState(post?.content ?? "");
  const [cover, setCover] = useState(post?.cover_image ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploads, setUploads] = useState(0);
  const [dragging, setDragging] = useState<"cover" | "content" | null>(null);
  const [error, setError] = useState("");
  const editor = useRef<HTMLTextAreaElement>(null);
  const contentPicker = useRef<HTMLInputElement>(null);
  const coverPicker = useRef<HTMLInputElement>(null);

  async function track<T>(work: Promise<T>): Promise<T | undefined> {
    setUploads((count) => count + 1);
    try {
      return await work;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setUploads((count) => count - 1);
    }
  }

  async function addCover(files: File[]) {
    if (files.length === 0) return;
    setError("");
    const url = await track(uploadImage(files[0]));
    if (url) setCover(url);
  }

  // Each image gets a placeholder at the cursor, replaced once it is stored.
  async function insertImages(files: File[]) {
    if (files.length === 0) return;
    setError("");
    setTab("write");
    const at = editor.current?.selectionEnd ?? content.length;
    const stamp = Date.now();
    const placeholders = files.map(
      (file, index) => `![Uploading ${file.name}…](uploading-${stamp}-${index})`
    );
    setContent((text) => {
      // Images are their own paragraphs: one blank line on each side.
      const before = text.slice(0, at).replace(/\n*$/, "");
      const after = text.slice(at).replace(/^\n*/, "");
      return [before, ...placeholders, after].filter(Boolean).join("\n\n");
    });
    await Promise.all(
      files.map(async (file, index) => {
        const url = await track(uploadImage(file));
        const image = url ? `![${altFromName(file)}](${url})` : "";
        setContent((text) => text.replace(placeholders[index], () => image));
      })
    );
  }

  function onDragOver(event: DragEvent, target: "cover" | "content") {
    if (![...event.dataTransfer.types].includes("Files")) return;
    event.preventDefault();
    setDragging(target);
  }

  function onDrop(event: DragEvent, target: "cover" | "content") {
    const files = imagesIn(event.dataTransfer.files);
    setDragging(null);
    if (files.length === 0) return;
    event.preventDefault();
    if (target === "cover") addCover(files);
    else insertImages(files);
  }

  function onPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const files = imagesIn(event.clipboardData.files);
    if (files.length === 0) return;
    event.preventDefault();
    insertImages(files);
  }

  return (
    <form action={action} className="mt-8 space-y-7">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="cover_image" value={cover} />

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={post?.title}
          placeholder="A great article title"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1.5 block text-sm text-muted">
          Excerpt{" "}
          <span className="opacity-60">
            (shown on cards and under the title)
          </span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt}
          placeholder="One or two sentences that make people want to read on."
          className={`${field} resize-y`}
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm text-muted">
          Cover image{" "}
          <span className="opacity-60">(optional, shown on cards and the article)</span>
        </p>
        <div
          onDragOver={(event) => onDragOver(event, "cover")}
          onDragLeave={() => setDragging(null)}
          onDrop={(event) => onDrop(event, "cover")}
          className={`overflow-hidden rounded-lg border bg-background transition-colors ${
            dragging === "cover" ? "border-accent" : "border-line"
          }`}
        >
          {cover ? (
            <div className="flex flex-wrap items-center gap-4 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of the stored URL */}
              <img
                src={cover}
                alt="Cover preview"
                className="aspect-[3/2] w-48 rounded-md bg-card object-cover"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className={quietButton}
                  onClick={() => coverPicker.current?.click()}
                  disabled={uploads > 0}
                >
                  Replace
                </button>
                <button
                  type="button"
                  className={quietButton}
                  onClick={() => setCover("")}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverPicker.current?.click()}
              disabled={uploads > 0}
              className="flex w-full flex-col items-center gap-1 px-4 py-8 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <span className="font-medium text-foreground">
                Add a cover image
              </span>
              <span>Click to choose, or drop an image here</span>
            </button>
          )}
        </div>
        <input
          ref={coverPicker}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            addCover(imagesIn(event.target.files));
            event.target.value = "";
          }}
        />
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="content" className="text-sm text-muted">
            Content <span className="opacity-60">(Markdown)</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-line p-0.5 text-sm">
              {(["write", "preview"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={tab === mode}
                  onClick={() => setTab(mode)}
                  className={`rounded-md px-3 py-1 capitalize transition-colors ${
                    tab === mode
                      ? "bg-white/10 text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={quietButton}
              onClick={() => contentPicker.current?.click()}
            >
              + Image
            </button>
            <input
              ref={contentPicker}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(event) => {
                insertImages(imagesIn(event.target.files));
                event.target.value = "";
              }}
            />
          </div>
        </div>
        <textarea
          ref={editor}
          id="content"
          name="content"
          rows={20}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onPaste={onPaste}
          onDragOver={(event) => onDragOver(event, "content")}
          onDragLeave={() => setDragging(null)}
          onDrop={(event) => onDrop(event, "content")}
          placeholder={"## Heading\n\nWrite anything you want here…"}
          className={`${field} resize-y font-mono leading-relaxed ${
            tab === "write" ? "" : "hidden"
          } ${dragging === "content" ? "border-accent" : ""}`}
        />
        {tab === "preview" && (
          <div className="min-h-64 rounded-lg border border-line bg-background px-6 py-8">
            {content.trim() ? (
              <ArticleBody content={content} />
            ) : (
              <p className="text-sm text-muted">Nothing to preview yet.</p>
            )}
          </div>
        )}
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Drop or paste images into the text, or use + Image. Images are
          resized and their location data removed before upload. Add a caption
          like this:{" "}
          <code className="font-mono text-foreground">
            ![Alt text](image-url &quot;Caption&quot;)
          </code>
        </p>
      </div>

      <div>
        <label htmlFor="tags" className="mb-1.5 block text-sm text-muted">
          Tags <span className="opacity-60">(comma separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={post?.tags}
          placeholder="web3, support, notes"
          className={field}
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post ? post.published === 1 : false}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        Publish this article
      </label>

      {(error || uploads > 0) && (
        <p
          role={error ? "alert" : "status"}
          className={`text-sm ${error ? "text-red-400" : "text-muted"}`}
        >
          {error ||
            `Uploading ${uploads} image${uploads === 1 ? "" : "s"}…`}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <button
          type="submit"
          disabled={uploads > 0}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitLabel}
        </button>
        <a
          href="/admin"
          className="rounded-lg border border-line px-5 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
