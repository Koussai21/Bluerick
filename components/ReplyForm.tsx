"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ReplyForm({ threadSlug }: { threadSlug: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  if (!user) {
    return (
      <div className="mt-10 rounded-lg border border-dashed border-neon-cyan/20 p-6 text-center text-sm text-slate-500">
        <Link href="/login" className="text-neon-cyan hover:underline">
          Connectez-vous
        </Link>{" "}
        pour répondre à ce sujet.
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/forum/threads/${threadSlug}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: fd.get("body") }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) { setError(data.error ?? "Erreur."); return; }
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-4">
      <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
        Votre réponse
        <textarea
          name="body"
          required
          rows={5}
          className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
        />
      </label>
      {error && <p className="text-sm text-neon-magenta">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="rounded border border-neon-cyan/60 bg-neon-cyan/10 px-6 py-2 font-display text-xs uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan/20 disabled:opacity-50"
      >
        {sending ? "Envoi…" : "Répondre"}
      </button>
    </form>
  );
}
