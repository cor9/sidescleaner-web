import Link from "next/link";
import type { Script, Role } from "@/lib/types";
import { PROJECT_TYPES, PRODUCTION_FORMATS } from "@/lib/types";

type Props = {
  script: Script;
  matchedRoles?: Role[];
};

export default function ScriptCard({ script, matchedRoles = [] }: Props) {
  const typeLabel = PROJECT_TYPES.find((t) => t.value === script.project_type)?.label ?? script.project_type;
  const formatLabel = PRODUCTION_FORMATS.find((f) => f.value === script.production_format)?.label ?? script.production_format;

  return (
    <Link href={`/scripts/${script.id}`} className="card p-5 block group">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h2 className="font-display italic text-2xl text-ink leading-tight group-hover:text-marquee-red transition-colors">
          {script.project_title || "Untitled"}
        </h2>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {typeLabel && <span className="chip">{typeLabel}</span>}
        {formatLabel && formatLabel !== "Unknown" && (
          <span className="chip">{formatLabel}</span>
        )}
        {script.genre?.slice(0, 3).map((g) => (
          <span key={g} className="chip">{g}</span>
        ))}
      </div>

      {script.synopsis && (
        <p className="text-sm text-ink-soft leading-relaxed line-clamp-3 mb-3">
          {script.synopsis}
        </p>
      )}

      {matchedRoles.length > 0 && (
        <div className="mt-3 pt-3 border-t border-ink/5">
          <div className="text-xs font-semibold uppercase tracking-wider text-marquee-red mb-1.5">
            Matching roles
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedRoles.slice(0, 4).map((r) => (
              <span key={r.id} className="text-xs text-ink-soft">
                <strong className="text-ink">{r.name}</strong>
                {r.age_range && ` · ${r.age_range}`}
                {r.gender && ` · ${r.gender}`}
                {r.is_lead_in_scene && " · lead"}
              </span>
            )).reduce<React.ReactNode[]>((acc, el, i) => {
              if (i > 0) acc.push(<span key={`sep-${i}`} className="text-ink-mute">·</span>);
              acc.push(el);
              return acc;
            }, [])}
          </div>
        </div>
      )}
    </Link>
  );
}
