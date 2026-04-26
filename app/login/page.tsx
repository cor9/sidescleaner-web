"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const params = useSearchParams();
  const queryError = params.get("error");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="display text-display-lg text-marquee-red mb-2">SidesCleaner</h1>
          <p className="text-ink-mute">Casting catalog access</p>
        </div>

        {queryError === "not_allowed" && (
          <div className="mb-4 p-3 rounded-md border border-marquee-red/30 bg-marquee-red/5 text-marquee-red-deep text-sm">
            Your email isn&apos;t on the allowlist for this catalog.
          </div>
        )}

        {status === "sent" ? (
          <div className="card p-6 text-center">
            <p className="font-display italic text-2xl text-marquee-red mb-2">Check your email.</p>
            <p className="text-ink-mute text-sm">
              We sent a magic link to <strong className="text-ink">{email}</strong>. Click it to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="card p-6 space-y-4">
            <label className="block">
              <span className="text-sm text-ink-soft mb-1.5 block">Email</span>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send magic link"}
            </button>
            {errorMsg && (
              <p className="text-sm text-marquee-red-deep">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
