import { NextRequest, NextResponse } from "next/server";
import { fetchPlans } from "@/lib/plans";
import { getSessionUser } from "@/lib/session";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  try {
    const plans = await fetchPlans({
      q: searchParams.get("q"),
      type: searchParams.get("type"),
      difficulty: searchParams.get("difficulty"),
    });
    return NextResponse.json({ plans });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    console.error("[api/plans GET]", e);
    return NextResponse.json({ error: message, plans: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

  try {
    const body = await req.json();
    const {
      title, description, printer_type, difficulty,
      source_url, repo_url, image_url, tags,
    } = body;

    if (!title?.trim())
      return NextResponse.json({ error: "Titre requis." }, { status: 400 });

    // Génère un slug unique depuis le titre
    const baseSlug = (title as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const suffix = Math.random().toString(36).slice(2, 6);
    const slug = `${baseSlug}-${suffix}`;

    const rows = await query(
      `INSERT INTO plans
         (slug, title, description, printer_type, difficulty, user_id, source_url, repo_url, image_url, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, slug`,
      [
        slug, title.trim(), description ?? null, printer_type ?? null,
        difficulty ?? null, user.id, source_url ?? null, repo_url ?? null,
        image_url ?? null, Array.isArray(tags) ? tags : [],
      ],
    );

    return NextResponse.json({ plan: rows[0] }, { status: 201 });
  } catch (e) {
    console.error("[api/plans POST]", e);
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
