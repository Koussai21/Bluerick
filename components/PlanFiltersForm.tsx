"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  initial: { q: string; type: string; difficulty: string };
};

export function PlanFiltersForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = String(fd.get("q") ?? "").trim();
    const type = String(fd.get("type") ?? "").trim();
    const difficulty = String(fd.get("difficulty") ?? "").trim();
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (type) sp.set("type", type);
    if (difficulty) sp.set("difficulty", difficulty);
    const qs = sp.toString();
    startTransition(() => {
      router.push(qs ? `/?${qs}` : "/");
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-10 grid gap-4 rounded-lg border border-neon-cyan/20 bg-void-900/40 p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
        Recherche
        <input
          name="q"
          type="search"
          defaultValue={initial.q}
          placeholder="titre, auteur, tag…"
          className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
        />
      </label>
      <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
        Type
        <input
          name="type"
          type="text"
          defaultValue={initial.type}
          placeholder="CoreXY, Cartésien…"
          className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
        />
      </label>
      <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
        Niveau
        <select
          name="difficulty"
          defaultValue={initial.difficulty}
          className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
        >
          <option value="">Tous</option>
          <option value="Débutant">Débutant</option>
          <option value="Intermédiaire">Intermédiaire</option>
          <option value="Avancé">Avancé</option>
        </select>
      </label>
      <div className="flex items-end gap-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded border border-neon-magenta/50 bg-neon-magenta/10 px-4 py-2 font-display text-xs uppercase tracking-widest text-neon-magenta transition hover:bg-neon-magenta/20 disabled:opacity-50"
        >
          {pending ? "Scan…" : "Filtrer"}
        </button>
      </div>
    </form>
  );
}
