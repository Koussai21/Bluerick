-- Base Bluerick : plans de construction d'imprimantes 3D
-- Exécuter sur la base : bluerick (localhost:5432)

-- ─── Fonction updated_at ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Utilisateurs ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(60) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- ─── Sessions ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  token VARCHAR(128) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions (user_id);

-- ─── Plans ──────────────────────────────────────────────────────────────────
-- Ajout de user_id si la table existe déjà sans cette colonne
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='plans' AND column_name='user_id'
  ) THEN
    ALTER TABLE plans ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  printer_type VARCHAR(120),
  difficulty VARCHAR(50),
  -- author est conservé pour les plans importés sans compte
  author VARCHAR(255),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  source_url TEXT,
  repo_url TEXT,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plans_featured ON plans (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_plans_printer_type ON plans (printer_type);
CREATE INDEX IF NOT EXISTS idx_plans_difficulty ON plans (difficulty);
CREATE INDEX IF NOT EXISTS idx_plans_tags ON plans USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_plans_user ON plans (user_id);

DROP TRIGGER IF EXISTS plans_updated_at ON plans;
CREATE TRIGGER plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- ─── Forum ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS forum_threads (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threads_user ON forum_threads (user_id);

DROP TRIGGER IF EXISTS threads_updated_at ON forum_threads;
CREATE TRIGGER threads_updated_at
  BEFORE UPDATE ON forum_threads
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TABLE IF NOT EXISTS forum_posts (
  id SERIAL PRIMARY KEY,
  thread_id INTEGER NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_thread ON forum_posts (thread_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON forum_posts (user_id);

DROP TRIGGER IF EXISTS posts_updated_at ON forum_posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
