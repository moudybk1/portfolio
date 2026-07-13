"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm text-muted"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-lg border border-line bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>
      {state.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
