import type { Post } from "@/lib/posts";

type Props = {
  post?: Post;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export default function PostForm({ post, action, submitLabel }: Props) {
  return (
    <form action={action} className="mt-8 space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}

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
          className="w-full rounded-lg border border-line bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1.5 block text-sm text-muted">
          Excerpt <span className="opacity-60">(short summary for lists)</span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt}
          placeholder="One or two sentences shown on the articles list."
          className="w-full resize-y rounded-lg border border-line bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm text-muted">
          Content <span className="opacity-60">(Markdown supported)</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={18}
          defaultValue={post?.content}
          placeholder={"## Heading\n\nWrite anything you want here…"}
          className="w-full resize-y rounded-lg border border-line bg-background px-3.5 py-2.5 font-mono text-sm leading-relaxed outline-none transition-colors focus:border-accent"
        />
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
          className="w-full rounded-lg border border-line bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
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

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
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
