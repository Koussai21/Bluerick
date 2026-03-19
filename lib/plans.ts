import { query, type PlanRow } from "@/lib/db";

export type PlanFilters = {
  q?: string | null;
  type?: string | null;
  difficulty?: string | null;
};

export async function fetchPlans(filters: PlanFilters = {}): Promise<PlanRow[]> {
  const q = filters.q?.trim();
  const type = filters.type?.trim();
  const difficulty = filters.difficulty?.trim();

  const conditions: string[] = ["1=1"];
  const params: unknown[] = [];
  let i = 1;

  if (q) {
    conditions.push(
      `(title ILIKE $${i} OR description ILIKE $${i} OR author ILIKE $${i} OR EXISTS (SELECT 1 FROM unnest(COALESCE(tags, ARRAY[]::text[])) t WHERE t ILIKE $${i}))`,
    );
    params.push(`%${q}%`);
    i++;
  }
  if (type) {
    conditions.push(`printer_type ILIKE $${i}`);
    params.push(`%${type}%`);
    i++;
  }
  if (difficulty) {
    conditions.push(`difficulty ILIKE $${i}`);
    params.push(`%${difficulty}%`);
    i++;
  }

  const sql = `
    SELECT id, slug, title, description, printer_type, difficulty, author,
           source_url, repo_url, image_url, tags, featured, created_at, updated_at
    FROM plans
    WHERE ${conditions.join(" AND ")}
    ORDER BY featured DESC, title ASC
  `;

  return query<PlanRow>(sql, params);
}

export async function fetchPlanBySlug(slug: string): Promise<PlanRow | null> {
  const rows = await query<PlanRow>(
    `SELECT id, slug, title, description, printer_type, difficulty, author,
            source_url, repo_url, image_url, tags, featured, created_at, updated_at
     FROM plans WHERE slug = $1 LIMIT 1`,
    [slug],
  );
  return rows[0] ?? null;
}
