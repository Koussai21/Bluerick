import { NextResponse } from "next/server";
import { fetchPlanBySlug } from "@/lib/plans";

export const dynamic = "force-dynamic";

type RouteContext = { params: { slug: string } };

export async function GET(_req: Request, context: RouteContext) {
  const { slug } = context.params;
  try {
    const plan = await fetchPlanBySlug(slug);
    if (!plan) {
      return NextResponse.json({ error: "Plan introuvable" }, { status: 404 });
    }
    return NextResponse.json({ plan });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    console.error("[api/plans/slug]", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
