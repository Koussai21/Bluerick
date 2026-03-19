import { Suspense } from "react";
import { PlanCard } from "@/components/PlanCard";
import { PlanFiltersForm } from "@/components/PlanFiltersForm";
import { fetchPlans } from "@/lib/plans";

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

async function PlanGrid({ searchParams }: { searchParams: SearchParams }) {
  const plans = await fetchPlans({
    q: first(searchParams.q),
    type: first(searchParams.type),
    difficulty: first(searchParams.difficulty),
  });

  if (!plans.length) {
    return (
      <div className="rounded-lg border border-dashed border-neon-magenta/30 bg-void-900/50 p-12 text-center">
        <p className="font-display text-neon-magenta animate-pulseSlow">
          AUCUN SIGNAL
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Aucun plan ne correspond aux filtres — ou la base est vide. Lancez{" "}
          <code className="text-neon-cyan/80">npm run db:setup</code> puis{" "}
          <code className="text-neon-cyan/80">npm run db:seed</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((p) => (
        <PlanCard key={p.id} plan={p} />
      ))}
    </div>
  );
}

export default function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-12 text-center sm:text-left">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan/70">
          Réseau constructeurs
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          <span className="cyber-glow-text text-neon-cyan">PLANS</span>{" "}
          <span className="text-slate-300">3D</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
          Index cyberpunk des kits, dérivés et archives open-source pour
          assembler votre propre machine. Filtrez par architecture, niveau,
          mots-clés.
        </p>
      </section>

      <PlanFiltersForm
        initial={{
          q: first(searchParams.q) ?? "",
          type: first(searchParams.type) ?? "",
          difficulty: first(searchParams.difficulty) ?? "",
        }}
      />

      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-lg border border-neon-cyan/10 bg-void-800/40"
              />
            ))}
          </div>
        }
      >
        <PlanGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
