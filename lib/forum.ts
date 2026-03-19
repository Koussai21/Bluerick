import { query } from "@/lib/db";

export type ThreadRow = {
  id: number;
  slug: string;
  title: string;
  user_id: number;
  username: string;
  post_count: number;
  created_at: Date;
  updated_at: Date;
};

export type PostRow = {
  id: number;
  thread_id: number;
  user_id: number;
  username: string;
  avatar_url: string | null;
  body: string;
  created_at: Date;
};

export async function fetchThreads(): Promise<ThreadRow[]> {
  return query<ThreadRow>(`
    SELECT t.id, t.slug, t.title, t.user_id, u.username,
           COUNT(p.id)::int AS post_count,
           t.created_at, t.updated_at
    FROM forum_threads t
    JOIN users u ON u.id = t.user_id
    LEFT JOIN forum_posts p ON p.thread_id = t.id
    GROUP BY t.id, u.username
    ORDER BY t.updated_at DESC
  `);
}

export async function fetchThreadBySlug(slug: string): Promise<ThreadRow | null> {
  const rows = await query<ThreadRow>(`
    SELECT t.id, t.slug, t.title, t.user_id, u.username,
           COUNT(p.id)::int AS post_count,
           t.created_at, t.updated_at
    FROM forum_threads t
    JOIN users u ON u.id = t.user_id
    LEFT JOIN forum_posts p ON p.thread_id = t.id
    WHERE t.slug = $1
    GROUP BY t.id, u.username
    LIMIT 1
  `, [slug]);
  return rows[0] ?? null;
}

export async function fetchPosts(threadId: number): Promise<PostRow[]> {
  return query<PostRow>(`
    SELECT fp.id, fp.thread_id, fp.user_id, u.username, u.avatar_url,
           fp.body, fp.created_at
    FROM forum_posts fp
    JOIN users u ON u.id = fp.user_id
    WHERE fp.thread_id = $1
    ORDER BY fp.created_at ASC
  `, [threadId]);
}
