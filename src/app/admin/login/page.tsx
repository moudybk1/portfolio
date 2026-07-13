import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login | Moudy" };

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="glow flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-8">
        <p className="font-mono text-sm text-accent">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Welcome back.
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
