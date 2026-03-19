import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-6xl text-neon-magenta cyber-glow-text">
        404
      </p>
      <p className="mt-4 text-sm uppercase tracking-widest text-slate-500">
        Segment de données introuvable
      </p>
      <Link
        href="/"
        className="mt-8 rounded border border-neon-cyan px-6 py-2 text-sm text-neon-cyan hover:bg-neon-cyan/10"
      >
        Retour au réseau
      </Link>
    </div>
  );
}
