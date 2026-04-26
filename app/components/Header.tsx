"use client";

import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function Header({ email }: { email?: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-ink/10 bg-cream-light sticky top-0 z-10 backdrop-blur-sm bg-cream-light/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display italic text-2xl text-marquee-red">SidesCleaner</span>
          <span className="text-xs text-ink-mute hidden sm:inline">casting catalog</span>
        </Link>
        {email && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-ink-mute hidden sm:inline">{email}</span>
            <button onClick={signOut} className="btn btn-ghost text-xs gap-1.5">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
