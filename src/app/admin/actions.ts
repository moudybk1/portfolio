"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSession,
  destroySession,
  getAdminPassword,
  isAuthenticated,
} from "@/lib/auth";
import { createPost, deletePost, updatePost } from "@/lib/posts";

export async function login(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password");
  if (password !== getAdminPassword()) {
    return { error: "Wrong password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function postInput(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    excerpt: String(formData.get("excerpt") || "").trim(),
    content: String(formData.get("content") || ""),
    tags: String(formData.get("tags") || "").trim(),
    published: formData.get("published") === "on",
  };
}

export async function createPostAction(formData: FormData): Promise<void> {
  await requireAuth();
  const input = postInput(formData);
  if (!input.title) return;
  await createPost(input);
  revalidatePath("/");
  revalidatePath("/articles");
  redirect("/admin");
}

export async function updatePostAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = Number(formData.get("id"));
  const input = postInput(formData);
  if (!id || !input.title) return;
  await updatePost(id, input);
  revalidatePath("/");
  revalidatePath("/articles");
  redirect("/admin");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = Number(formData.get("id"));
  if (id) await deletePost(id);
  revalidatePath("/");
  revalidatePath("/articles");
}
