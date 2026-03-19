import { NextResponse } from "next/server";
import { fetchThreadBySlug, fetchPosts } from "@/lib/forum";

export const dynamic = "force-dynamic";

type Ctx = { params: { slug: string } };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const thread = await fetchThreadBySlug(ctx.params.slug);
    if (!thread)
      return NextResponse.json({ error: "Discussion introuvable." }, { status: 404 });

    const posts = await fetchPosts(thread.id);
    return NextResponse.json({ thread, posts });
  } catch (e) {
    console.error("[api/forum/threads/slug GET]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
