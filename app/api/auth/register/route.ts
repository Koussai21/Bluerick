import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password)
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });

    if ((username as string).length < 2)
      return NextResponse.json(
        { error: "Pseudo trop court (min 2 caractères)." },
        { status: 400 },
      );

    if ((password as string).length < 6)
      return NextResponse.json(
        { error: "Mot de passe trop court (min 6 caractères)." },
        { status: 400 },
      );

    const user = await createUser(username, email, password);
    await createSession(user.id);
    return NextResponse.json(
      { user: { id: user.id, username: user.username, email: user.email } },
      { status: 201 },
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    // Violation de contrainte UNIQUE
    if (msg.includes("unique") || msg.includes("dupliqué")) {
      return NextResponse.json(
        { error: "Pseudo ou email déjà utilisé." },
        { status: 409 },
      );
    }
    console.error("[register]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
