import Image from "next/image";
import Link from "next/link";

export type PlanSummary = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  printer_type: string | null;
  difficulty: string | null;
  author: string | null;
  image_url: string | null;
  tags: string[] | null;
  featured: boolean;
};

function badgeClass(difficulty: string | null) {
  const d = (difficulty ?? "").toLowerCase();
  if (d.includes("débutant") || d.includes("debutant"))
    return "border-neon-green/50 text-neon-green bg-neon-green/5";
  if (d.includes("inter")) return "border-neon-yellow/50 text-neon-yellow bg-neon-yellow/5";
  if (d.includes("avanc")) return "border-neon-magenta/50 text-neon-magenta bg-neon-magenta/5";
  return "border-slate-500/50 text-slate-400";
}

export function PlanCard({ plan }: { plan: PlanSummary }) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-neon-cyan/20 bg-void-800/60 cyber-border transition hover:border-neon-cyan/50 hover:shadow-neon">
      {plan.featured && (
        <div className="absolute right-3 top-3 z-10 rounded border border-neon-magenta/60 bg-void-950/90 px-2 py-0.5 text-[9px] font-display uppercase tracking-widest text-neon-magenta">
          Featured
        </div>
      )}
      <Link href={`/plan/${plan.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-void-900">
          {plan.image_url ? (
            <Image
              src={plan.image_url}
              alt={plan.title}
              fill
              className="object-cover opacity-80 transition group-hover:opacity-100 group-hover:scale-[1.02]"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-4xl text-neon-cyan/20">
              3D
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-transparent to-transparent" />
        </div>
        <div className="space-y-2 p-4">
          <h2 className="font-display text-lg font-semibold tracking-wide text-white transition group-hover:text-neon-cyan">
            {plan.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
            {plan.description ?? "—"}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {plan.printer_type && (
              <span className="rounded border border-neon-cyan/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neon-cyan/90">
                {plan.printer_type}
              </span>
            )}
            {plan.difficulty && (
              <span
                className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${badgeClass(plan.difficulty)}`}
              >
                {plan.difficulty}
              </span>
            )}
          </div>
          {(plan.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {plan.tags!.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[10px] text-slate-500 before:content-['#']"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
