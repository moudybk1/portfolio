import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import PostForm from "@/components/PostForm";
import { createPostAction } from "../actions";

export const metadata = { title: "New Article | Moudy" };

export default async function NewPostPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/admin"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Back to admin
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          New article
        </h1>
        <PostForm action={createPostAction} submitLabel="Create article" />
      </div>
    </main>
  );
}
