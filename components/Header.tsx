"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neon-cyan/20 bg-void-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-display text-xl font-bold tracking-widest text-neon-cyan cyber-glow-text transition group-hover:text-white">
            ◆
          </span>
          <div>
            <span className="font-display text-lg font-bold tracking-[0.35em] text-white">
              BLUERICK
            </span>
            <span className="block text-[10px] uppercase tracking-[0.5em] text-neon-magenta/80">
              construct_3d
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-xs uppercase tracking-widest">
          <Link href="/" className="text-neon-cyan/80 hover:text-neon-cyan">
            Catalogue
          </Link>
          <Link href="/forum" className="text-neon-cyan/80 hover:text-neon-cyan">
            Forum
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/plan/new"
                    className="rounded border border-neon-cyan/50 px-3 py-1 text-neon-cyan hover:bg-neon-cyan/10"
                  >
                    + Plan
                  </Link>
                  <span className="hidden text-slate-500 sm:inline">
                    {user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-neon-magenta"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-400 hover:text-neon-cyan">
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="rounded border border-neon-magenta/50 px-3 py-1 text-neon-magenta hover:bg-neon-magenta/10"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
