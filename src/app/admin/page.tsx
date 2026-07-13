import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listAllPosts } from "@/lib/posts";
import { deletePostAction, logout } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin | Moudy" };

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const posts = listAllPosts();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-accent">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Articles
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            >
              View site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                Log out
              </button>
            </form>
            <Link
              href="/admin/new"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              + New article
            </Link>
          </div>
        </div>

        <div className="mt-10 space-y-3">
          {posts.length === 0 && (
            <p className="rounded-xl border border-line bg-card p-8 text-center text-muted">
              No articles yet. Write your first one.
            </p>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-card p-5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="truncate font-medium">{post.title}</h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.published
                        ? "bg-accent-soft text-accent"
                        : "bg-white/5 text-muted"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-muted">
                  /articles/{post.slug} · updated{" "}
                  {new Date(post.updated_at + "Z").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {post.published === 1 && (
                  <Link
                    href={`/articles/${post.slug}`}
                    className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    View
                  </Link>
                )}
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm transition-colors hover:bg-white/5"
                >
                  Edit
                </Link>
                <form action={deletePostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
