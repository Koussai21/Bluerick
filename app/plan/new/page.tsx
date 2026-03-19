"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const DIFFICULTIES = ["Débutant", "Intermédiaire", "Avancé"];

export default function NewPlanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) return null;
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="mb-6 text-slate-400">Connexion requise pour publier un plan.</p>
        <Link
          href="/login"
          className="rounded border border-neon-cyan px-6 py-2 text-sm text-neon-cyan hover:bg-neon-cyan/10"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const tagsRaw = (fd.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean);

    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description"),
        printer_type: fd.get("printer_type"),
        difficulty: fd.get("difficulty"),
        source_url: fd.get("source_url"),
        repo_url: fd.get("repo_url"),
        image_url: fd.get("image_url"),
        tags: tagsRaw,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Erreur lors de la publication.");
      return;
    }
    router.push(`/plan/${data.plan.slug}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 font-display text-2xl font-bold tracking-widest text-neon-cyan cyber-glow-text">
        NOUVEAU PLAN
      </h1>
      <form onSubmit={onSubmit} className="space-y-5">
        <Field name="title" label="Titre *" type="text" required />
        <div className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
          Description
          <textarea
            name="description"
            rows={4}
            className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="printer_type" label="Type (CoreXY, Delta…)" type="text" />
          <div className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
            Niveau
            <select
              name="difficulty"
              className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 focus:border-neon-cyan focus:outline-none"
            >
              <option value="">—</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <Field name="source_url" label="URL source" type="url" />
        <Field name="repo_url" label="URL dépôt" type="url" />
        <Field name="image_url" label="URL image de couverture" type="url" />
        <Field
          name="tags"
          label="Tags (séparés par virgule)"
          type="text"
          placeholder="CoreXY, open-source, delta"
        />

        {error && (
          <p className="rounded border border-neon-magenta/40 bg-neon-magenta/10 px-3 py-2 text-sm text-neon-magenta">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded border border-neon-cyan/60 bg-neon-cyan/10 py-2 font-display text-sm uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan/20 disabled:opacity-50"
        >
          {saving ? "Publication…" : "Publier le plan"}
        </button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
      />
    </label>
  );
}
