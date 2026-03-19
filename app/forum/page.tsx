import Link from "next/link";
import { fetchThreads } from "@/lib/forum";
import { NewThreadButton } from "@/components/NewThreadButton";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const threads = await fetchThreads();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan/70">
            Réseau
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            <span className="cyber-glow-text text-neon-cyan">FORUM</span>
          </h1>
        </div>
        <NewThreadButton />
      </div>

      {threads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neon-magenta/30 p-12 text-center text-slate-500">
          Aucun sujet — soyez le premier à ouvrir une discussion.
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((t) => (
            <Link
              key={t.id}
              href={`/forum/${t.slug}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-neon-cyan/15 bg-void-800/50 px-5 py-4 transition hover:border-neon-cyan/40 hover:bg-void-800"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-white">
                  {t.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  par{" "}
                  <span className="text-neon-cyan/80">{t.username}</span>
                  {" · "}
                  {formatDate(t.created_at)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="rounded border border-slate-600/40 px-2 py-0.5 text-xs text-slate-400">
                  {t.post_count} msg
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
