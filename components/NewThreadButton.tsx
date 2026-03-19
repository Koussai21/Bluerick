"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function NewThreadButton() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <a
        href="/login"
        className="rounded border border-neon-magenta/50 px-4 py-2 text-xs uppercase tracking-widest text-neon-magenta hover:bg-neon-magenta/10"
      >
        + Nouveau sujet
      </a>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/forum/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: fd.get("title"), body: fd.get("body") }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Erreur."); return; }
    setOpen(false);
    router.push(`/forum/${data.thread.slug}`);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded border border-neon-magenta/50 px-4 py-2 text-xs uppercase tracking-widest text-neon-magenta hover:bg-neon-magenta/10"
      >
        + Nouveau sujet
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-950/80 p-4">
          <div className="w-full max-w-lg rounded-lg border border-neon-cyan/30 bg-void-900 p-6 shadow-neon">
            <h2 className="mb-5 font-display text-lg tracking-widest text-neon-cyan">
              NOUVEAU SUJET
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
                Titre *
                <input
                  name="title"
                  required
                  className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 focus:border-neon-cyan focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
                Premier message *
                <textarea
                  name="body"
                  required
                  rows={5}
                  className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 focus:border-neon-cyan focus:outline-none"
                />
              </label>
              {error && (
                <p className="text-sm text-neon-magenta">{error}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded border border-neon-cyan/60 py-2 text-xs uppercase tracking-widest text-neon-cyan hover:bg-neon-cyan/10 disabled:opacity-50"
                >
                  {saving ? "Envoi…" : "Créer"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded border border-slate-600/40 px-4 py-2 text-xs uppercase text-slate-400 hover:text-slate-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
