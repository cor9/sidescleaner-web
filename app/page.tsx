import { createClient } from "@/lib/supabase-server";
import { AGE_BUCKETS, type Filters, type Role, type Script } from "@/lib/types";
import FilterSidebar from "./components/FilterSidebar";
import SearchBar from "./components/SearchBar";
import ScriptCard from "./components/ScriptCard";
import Header from "./components/Header";

type SearchParams = Promise<{ [k: string]: string | undefined }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters: Filters = {
    q: params.q,
    project_type: params.project_type,
    production_format: params.production_format,
    gender: params.gender,
    age_range: params.age_range,
    genre: params.genre,
    lead_only: params.lead_only === "1",
  };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Determine if any role-level filter is active
  const roleFiltersActive =
    !!filters.gender || !!filters.age_range || !!filters.lead_only;

  // ----- Step 1: build script-level query -----
  let scriptQuery = supabase
    .from("scripts")
    .select("*, roles(*)")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (filters.project_type) scriptQuery = scriptQuery.eq("project_type", filters.project_type);
  if (filters.production_format) scriptQuery = scriptQuery.eq("production_format", filters.production_format);
  if (filters.genre) scriptQuery = scriptQuery.contains("genre", [filters.genre]);
  if (filters.q) {
    const q = filters.q.replace(/[%]/g, "");
    scriptQuery = scriptQuery.or(
      `project_title.ilike.%${q}%,synopsis.ilike.%${q}%,scene_summary.ilike.%${q}%,tone.ilike.%${q}%`
    );
  }

  const { data: scripts, error } = await scriptQuery;

  // ----- Step 2: filter by role attributes in memory (for the role chips) -----
  let results: Array<{ script: Script; matchedRoles: Role[] }> = [];
  if (scripts) {
    for (const s of scripts as (Script & { roles: Role[] })[]) {
      let roles: Role[] = s.roles ?? [];
      if (filters.gender) {
        roles = roles.filter((r) =>
          r.gender ? r.gender.toLowerCase().includes(filters.gender!.toLowerCase()) : false
        );
      }
      if (filters.age_range) {
        const bucket = AGE_BUCKETS.find((b) => b.value === filters.age_range);
        if (bucket) {
          const re = new RegExp(bucket.regex.replace(/\\m/g, "\\b").replace(/\\M/g, "\\b"), "i");
          roles = roles.filter((r) => (r.age_range ? re.test(r.age_range) : false));
        }
      }
      if (filters.lead_only) {
        roles = roles.filter((r) => r.is_lead_in_scene);
      }
      if (roleFiltersActive && roles.length === 0) continue;
      results.push({ script: s, matchedRoles: roles });
    }
  }

  // ----- Step 3: gather all genres for the sidebar -----
  const allGenres = Array.from(
    new Set(
      (scripts ?? [])
        .flatMap((s: any) => s.genre ?? [])
        .map((g: string) => String(g).trim())
        .filter(Boolean)
    )
  ).sort();

  return (
    <>
      <Header email={user?.email} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="display text-display-lg text-ink mb-2">
            <em className="text-marquee-red">Find</em> the right side.
          </h1>
          <p className="text-ink-mute">
            {scripts?.length ?? 0} scripts catalogued · search by title, character, or scene
          </p>
        </div>

        <div className="mb-6">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          <FilterSidebar allGenres={allGenres} />

          <section>
            {error && (
              <div className="card p-4 mb-4 text-sm text-marquee-red-deep border-marquee-red/20">
                Error loading scripts: {error.message}
              </div>
            )}

            {results.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="font-display italic text-2xl text-ink-mute mb-2">
                  Nothing matches yet.
                </p>
                <p className="text-sm text-ink-mute">
                  Try removing a filter or broadening your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {results.map(({ script, matchedRoles }) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    matchedRoles={roleFiltersActive ? matchedRoles : []}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
