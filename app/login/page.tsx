"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Erreur inconnue.");
      return;
    }
    await refresh();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="mb-8 font-display text-2xl font-bold tracking-widest text-neon-cyan cyber-glow-text">
        CONNEXION
      </h1>
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
          />
        </label>
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-neon-cyan/80">
          Mot de passe
          <input
            name="password"
            type="password"
            required
            className="rounded border border-slate-600/50 bg-void-950 px-3 py-2 text-sm text-slate-200 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan"
          />
        </label>

        {error && (
          <p className="rounded border border-neon-magenta/40 bg-neon-magenta/10 px-3 py-2 text-sm text-neon-magenta">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded border border-neon-cyan/60 bg-neon-cyan/10 py-2 font-display text-sm uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan/20 disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-neon-cyan hover:underline">
          Inscription
        </Link>
      </p>
    </div>
  );
}
