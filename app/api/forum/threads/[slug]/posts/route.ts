import { NextRequest, NextResponse } from "next/server";
import { fetchThreadBySlug } from "@/lib/forum";
import { getSessionUser } from "@/lib/session";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type Ctx = { params: { slug: string } };

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

  try {
    const thread = await fetchThreadBySlug(ctx.params.slug);
    if (!thread)
      return NextResponse.json({ error: "Discussion introuvable." }, { status: 404 });

    const { body } = await req.json();
    if (!body?.trim())
      return NextResponse.json({ error: "Message vide." }, { status: 400 });

    // Met à jour updated_at du thread pour remonter dans la liste
    await query("UPDATE forum_threads SET updated_at = NOW() WHERE id = $1", [thread.id]);

    const rows = await query(
      `INSERT INTO forum_posts (thread_id, user_id, body) VALUES ($1,$2,$3)
       RETURNING id, created_at`,
      [thread.id, user.id, body.trim()],
    );

    return NextResponse.json({ post: rows[0] }, { status: 201 });
  } catch (e) {
    console.error("[api/forum/posts POST]", e);
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
