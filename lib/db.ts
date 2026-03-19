import { Pool, QueryResultRow } from "pg";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/bluerick";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
  });
}

export const pool = globalThis.__pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = pool;
}

export type PlanRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  printer_type: string | null;
  difficulty: string | null;
  author: string | null;
  source_url: string | null;
  repo_url: string | null;
  image_url: string | null;
  tags: string[] | null;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
};

export async function query<T extends QueryResultRow = PlanRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query<T>(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}
