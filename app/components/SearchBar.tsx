"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    startTransition(() => router.push(`/?${next.toString()}`));
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none"
      />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search title, character, synopsis…"
        className="input pl-10 pr-4 py-3 text-base"
      />
      {pending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-mute">
          Searching…
        </div>
      )}
    </form>
  );
}
