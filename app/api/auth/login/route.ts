import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });

    const user = await getUserByEmail(email);
    if (!user)
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 },
      );

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid)
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 },
      );

    await createSession(user.id);
    return NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (e) {
    console.error("[login]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
