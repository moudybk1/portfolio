"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyAdminPassword,
} from "@/lib/auth";
import { createPost, deletePost, updatePost } from "@/lib/posts";
import {
  authDelay,
  checkLoginRateLimit,
  clearLoginAttempts,
  getClientIp,
  recordFailedLogin,
} from "@/lib/rate-limit";

export type LoginState = {
  error?: string;
  locked?: boolean;
  retryAfterSeconds?: number;
};

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // Honeypot — bots that fill hidden fields get a silent fake failure
  const honeypot = String(formData.get("website") || "");
  if (honeypot.trim()) {
    await authDelay(800);
    return { error: "Wrong password." };
  }

  const ip = await getClientIp();
  const rate = await checkLoginRateLimit(ip);
  if (!rate.ok) {
    await authDelay(600);
    return {
      error: `Too many attempts. Try again in ${Math.ceil(rate.retryAfterSeconds / 60)} minutes.`,
      locked: true,
      retryAfterSeconds: rate.retryAfterSeconds,
    };
  }

  const password = String(formData.get("password") || "");
  await authDelay(); // constant-ish delay before comparing

  if (!verifyAdminPassword(password)) {
    await recordFailedLogin(ip);
    return { error: "Wrong password." };
  }

  await clearLoginAttempts(ip);
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
