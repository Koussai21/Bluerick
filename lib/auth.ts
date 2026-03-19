import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

const SALT_ROUNDS = 12;

export type UserRow = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
};

export async function createUser(
  username: string,
  email: string,
  password: string,
): Promise<UserRow> {
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const rows = await query<UserRow>(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, password_hash, avatar_url`,
    [username.trim(), email.trim().toLowerCase(), password_hash],
  );
  return rows[0];
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const rows = await query<UserRow>(
    `SELECT id, username, email, password_hash, avatar_url
     FROM users WHERE email = $1 LIMIT 1`,
    [email.trim().toLowerCase()],
  );
  return rows[0] ?? null;
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
