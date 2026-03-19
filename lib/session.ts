import { cookies } from "next/headers";
import crypto from "node:crypto";
import { query } from "@/lib/db";

const SESSION_COOKIE = "br_session";
const SESSION_DURATION_DAYS = 30;

export type SessionUser = {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
};

/** Crée une session en base et pose le cookie. */
export async function createSession(userId: number): Promise<void> {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  );

  await query(
    `INSERT INTO sessions (token, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [token, userId, expiresAt],
  );

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/** Récupère l'utilisateur connecté depuis le cookie de session. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await query<SessionUser & { expires_at: Date }>(
    `SELECT u.id, u.username, u.email, u.avatar_url, s.expires_at
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = $1`,
    [token],
  );

  const row = rows[0];
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    await deleteSession(token);
    return null;
  }

  return { id: row.id, username: row.username, email: row.email, avatar_url: row.avatar_url };
}

/** Supprime la session en base et efface le cookie. */
export async function deleteSession(token?: string): Promise<void> {
  const t = token ?? cookies().get(SESSION_COOKIE)?.value;
  if (t) {
    await query("DELETE FROM sessions WHERE token = $1", [t]);
  }
  cookies().delete(SESSION_COOKIE);
}
