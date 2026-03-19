import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[logout]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
