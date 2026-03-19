import { NextRequest, NextResponse } from "next/server";
import { fetchThreads } from "@/lib/forum";
import { getSessionUser } from "@/lib/session";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const threads = await fetchThreads();
    return NextResponse.json({ threads });
  } catch (e) {
    console.error("[api/forum/threads GET]", e);
    return NextResponse.json({ error: "Erreur serveur.", threads: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

  try {
    const { title, body } = await req.json();
    if (!title?.trim())
      return NextResponse.json({ error: "Titre requis." }, { status: 400 });
    if (!body?.trim())
      return NextResponse.json({ error: "Premier message requis." }, { status: 400 });

    const baseSlug = (title as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const suffix = Math.random().toString(36).slice(2, 6);
    const slug = `${baseSlug}-${suffix}`;

    const threadRows = await query(
      `INSERT INTO forum_threads (slug, title, user_id)
       VALUES ($1, $2, $3) RETURNING id, slug`,
      [slug, title.trim(), user.id],
    );
    const thread = threadRows[0] as { id: number; slug: string };

    await query(
      `INSERT INTO forum_posts (thread_id, user_id, body) VALUES ($1, $2, $3)`,
      [thread.id, user.id, body.trim()],
    );

    return NextResponse.json({ thread }, { status: 201 });
  } catch (e) {
    console.error("[api/forum/threads POST]", e);
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
