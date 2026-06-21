"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = hasSupabasePublicEnv();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) {
      setMessage("Supabase env vars are not configured for local admin login.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });

    if (error) {
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
        Email
        <input className="admin-input" name="email" required type="email" />
      </label>
      <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
        Password
        <input
          className="admin-input"
          name="password"
          required
          type="password"
        />
      </label>
      {!isConfigured ? (
        <p className="border border-[#F05267]/40 bg-[#F05267]/10 p-3 text-sm text-[#FFF9EF]">
          Add Supabase public env vars to enable admin login locally.
        </p>
      ) : null}
      {message ? <p className="text-sm text-[#F05267]">{message}</p> : null}
      <button
        className="bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF] disabled:opacity-50"
        disabled={isSubmitting || !isConfigured}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
