import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchThreadBySlug, fetchPosts } from "@/lib/forum";
import { ReplyForm } from "@/components/ReplyForm";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

function formatDateTime(d: Date) {
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function generateMetadata({ params }: Props) {
  const thread = await fetchThreadBySlug(params.slug);
  if (!thread) return { title: "Discussion | BLUERICK" };
  return { title: `${thread.title} | FORUM BLUERICK` };
}

export default async function ThreadPage({ params }: Props) {
  const thread = await fetchThreadBySlug(params.slug);
  if (!thread) notFound();

  const posts = await fetchPosts(thread.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/forum"
        className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neon-cyan/80 hover:text-neon-cyan"
      >
        ← Forum
      </Link>

      <h1 className="mb-8 font-display text-xl font-bold tracking-wide text-white sm:text-2xl">
        {thread.title}
      </h1>

      <div className="space-y-4">
        {posts.map((p, i) => (
          <article
            key={p.id}
            className="rounded-lg border border-neon-cyan/15 bg-void-800/50 p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-display text-xs text-neon-cyan">
                {p.username}
              </span>
              <span className="text-[10px] text-slate-500">
                #{i + 1} · {formatDateTime(p.created_at)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {p.body}
            </p>
          </article>
        ))}
      </div>

      <ReplyForm threadSlug={params.slug} />
    </div>
  );
}
