export function Footer() {
  return (
    <footer className="mt-auto border-t border-neon-magenta/15 bg-void-900/80">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-[11px] uppercase tracking-widest text-slate-500">
        <p>
          <span className="text-neon-cyan/70">SYS.MSG</span> — Données locales
          PostgreSQL · Plans à titre informatif · vérifiez les licences
          sources.
        </p>
        <p className="mt-2 font-display text-neon-magenta/50">
          {"// END OF LINE //"}
        </p>
      </div>
    </footer>
  );
}
