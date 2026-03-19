import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPlanBySlug } from "@/lib/plans";

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps) {
  const plan = await fetchPlanBySlug(params.slug);
  if (!plan) return { title: "Plan introuvable | BLUERICK" };
  return {
    title: `${plan.title} | BLUERICK`,
    description: plan.description ?? undefined,
  };
}

export default async function PlanPage({ params }: PageProps) {
  const plan = await fetchPlanBySlug(params.slug);
  if (!plan) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neon-cyan/80 hover:text-neon-cyan"
      >
        ← Retour catalogue
      </Link>

      <article className="overflow-hidden rounded-lg border border-neon-cyan/25 bg-void-800/50 cyber-border">
        <div className="relative aspect-[21/9] w-full bg-void-900">
          {plan.image_url ? (
            <Image
              src={plan.image_url}
              alt={plan.title}
              fill
              className="object-cover opacity-90"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-6xl text-neon-cyan/15">
              PLAN
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/40 to-transparent" />
        </div>

        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="font-display text-2xl font-bold tracking-wide text-white sm:text-3xl">
              {plan.title}
            </h1>
            {plan.featured && (
              <span className="shrink-0 rounded border border-neon-magenta/60 px-2 py-1 text-[10px] font-display uppercase tracking-widest text-neon-magenta">
                Featured
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {plan.printer_type && (
              <span className="rounded border border-neon-cyan/40 px-2 py-1 text-xs text-neon-cyan">
                {plan.printer_type}
              </span>
            )}
            {plan.difficulty && (
              <span className="rounded border border-slate-500/50 px-2 py-1 text-xs text-slate-300">
                {plan.difficulty}
              </span>
            )}
            {plan.author && (
              <span className="text-sm text-slate-500">
                Par <span className="text-slate-300">{plan.author}</span>
              </span>
            )}
          </div>

          <p className="leading-relaxed text-slate-300">
            {plan.description ?? "—"}
          </p>

          {(plan.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {plan.tags!.map((t) => (
                <span
                  key={t}
                  className="rounded bg-void-950 px-2 py-1 text-xs text-slate-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 border-t border-neon-cyan/10 pt-6">
            {plan.source_url && (
              <a
                href={plan.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-neon-cyan/50 px-4 py-2 text-sm text-neon-cyan transition hover:bg-neon-cyan/10"
              >
                Source / site
              </a>
            )}
            {plan.repo_url && (
              <a
                href={plan.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-neon-magenta/50 px-4 py-2 text-sm text-neon-magenta transition hover:bg-neon-magenta/10"
              >
                Dépôt (repo)
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
