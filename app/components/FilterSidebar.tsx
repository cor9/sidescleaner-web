"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PROJECT_TYPES, PRODUCTION_FORMATS, AGE_BUCKETS } from "@/lib/types";
import { X } from "lucide-react";

type Props = { allGenres: string[] };

export default function FilterSidebar({ allGenres }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function toggle(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (next.get(key) === value) next.delete(key);
    else next.set(key, value);
    startTransition(() => router.push(`/?${next.toString()}`));
  }

  function clearAll() {
    startTransition(() => router.push("/"));
  }

  const active = (key: string, value: string) => params.get(key) === value;
  const hasFilters = Array.from(params.keys()).some((k) => k !== "q");

  return (
    <aside className={`space-y-6 ${pending ? "opacity-60" : ""}`}>
      {hasFilters && (
        <button onClick={clearAll} className="btn btn-ghost text-xs gap-1 -ml-2">
          <X size={14} /> Clear filters
        </button>
      )}

      <FilterGroup label="Project type">
        {PROJECT_TYPES.map((t) => (
          <Chip
            key={t.value}
            label={t.label}
            active={active("project_type", t.value)}
            onClick={() => toggle("project_type", t.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Format">
        {PRODUCTION_FORMATS.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            active={active("production_format", f.value)}
            onClick={() => toggle("production_format", f.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Age range">
        {AGE_BUCKETS.map((a) => (
          <Chip
            key={a.value}
            label={a.label}
            active={active("age_range", a.value)}
            onClick={() => toggle("age_range", a.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Gender">
        {[
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
          { value: "nonbinary", label: "Non-binary" },
        ].map((g) => (
          <Chip
            key={g.value}
            label={g.label}
            active={active("gender", g.value)}
            onClick={() => toggle("gender", g.value)}
          />
        ))}
      </FilterGroup>

      {allGenres.length > 0 && (
        <FilterGroup label="Genre">
          {allGenres.map((g) => (
            <Chip
              key={g}
              label={g}
              active={active("genre", g)}
              onClick={() => toggle("genre", g)}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup label="Role size">
        <Chip
          label="Lead in scene only"
          active={params.get("lead_only") === "1"}
          onClick={() => toggle("lead_only", "1")}
        />
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-mute mb-2">
        {label}
      </h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`chip cursor-pointer ${active ? "chip-active" : ""}`}>
      {label}
    </button>
  );
}
