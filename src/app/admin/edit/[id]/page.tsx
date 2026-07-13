import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getPostById } from "@/lib/posts";
import PostForm from "@/components/PostForm";
import { updatePostAction } from "../../actions";

export const metadata = { title: "Edit Article | Moudy" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const post = getPostById(Number(id));
  if (!post) notFound();

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
          Edit article
        </h1>
        <p className="mt-1 font-mono text-xs text-muted">/articles/{post.slug}</p>
        <PostForm
          post={post}
          action={updatePostAction}
          submitLabel="Save changes"
        />
      </div>
    </main>
  );
}
