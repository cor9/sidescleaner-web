import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";
import { PROJECT_TYPES, PRODUCTION_FORMATS, type Role, type Script } from "@/lib/types";
import Header from "@/app/components/Header";

type Params = Promise<{ id: string }>;

export default async function ScriptDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: script } = await supabase
    .from("scripts")
    .select("*")
    .eq("id", id)
    .maybeSingle<Script>();

  if (!script) notFound();

  const { data: roles } = await supabase
    .from("roles")
    .select("*")
    .eq("script_id", id)
    .order("is_lead_in_scene", { ascending: false });

  const typeLabel = PROJECT_TYPES.find((t) => t.value === script.project_type)?.label ?? script.project_type;
  const formatLabel = PRODUCTION_FORMATS.find((f) => f.value === script.production_format)?.label ?? script.production_format;

  return (
    <>
      <Header email={user?.email} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="btn btn-ghost text-sm gap-1.5 -ml-2 mb-6">
          <ArrowLeft size={16} /> Back to catalog
        </Link>

        <div className="mb-8">
          <h1 className="display text-display-xl text-ink leading-tight mb-3">
            {script.project_title || "Untitled"}
          </h1>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {typeLabel && <span className="chip">{typeLabel}</span>}
            {formatLabel && formatLabel !== "Unknown" && (
              <span className="chip">{formatLabel}</span>
            )}
            {script.genre?.map((g) => (
              <span key={g} className="chip">{g}</span>
            ))}
          </div>

          {script.tone && (
            <p className="font-display italic text-xl text-marquee-red mb-4">
              {script.tone}
            </p>
          )}

          {script.storage_url && (
            <a
              href={script.storage_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm gap-1.5"
            >
              <FileText size={16} /> View original PDF
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {script.logline && (
          <Section title="Logline">
            <p className="text-lg text-ink leading-relaxed">{script.logline}</p>
          </Section>
        )}

        {script.synopsis && (
          <Section title="Synopsis">
            <p className="text-ink-soft leading-relaxed">{script.synopsis}</p>
          </Section>
        )}

        {script.scene_summary && (
          <Section title={`Scene${script.scene_count && script.scene_count > 1 ? "s" : ""}${script.scene_count ? ` (${script.scene_count})` : ""}`}>
            <p className="text-ink-soft leading-relaxed">{script.scene_summary}</p>
          </Section>
        )}

        {roles && roles.length > 0 && (
          <Section title={`Characters (${roles.length})`}>
            <div className="space-y-3">
              {roles.map((r: Role) => (
                <div
                  key={r.id}
                  className={`p-4 rounded-md border ${
                    r.is_lead_in_scene
                      ? "border-marquee-red/30 bg-marquee-red/5"
                      : "border-ink/10 bg-cream-light"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-display italic text-xl text-ink">
                      {r.name || "Unnamed"}
                    </h3>
                    {r.is_lead_in_scene && (
                      <span className="chip chip-active text-xs whitespace-nowrap">Lead in scene</span>
                    )}
                  </div>
                  <div className="text-xs text-ink-mute mb-2 flex flex-wrap gap-x-3">
                    {r.age_range && <span>{r.age_range}</span>}
                    {r.gender && <span>{r.gender}</span>}
                  </div>
                  {r.description && (
                    <p className="text-sm text-ink-soft leading-relaxed">{r.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {script.extraction_notes && (
          <Section title="Notes">
            <p className="text-sm text-ink-mute italic leading-relaxed">{script.extraction_notes}</p>
          </Section>
        )}

        <div className="mt-12 pt-6 border-t border-ink/10 text-xs text-ink-mute">
          Source: <code className="text-ink-soft">{script.source_filename}</code>
          <span className="mx-2">·</span>
          Catalogued {new Date(script.created_at).toLocaleDateString()}
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-mute mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
