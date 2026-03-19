import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/bluerick";

async function main() {
  const pool = new pg.Pool({ connectionString });
  const sql = readFileSync(join(__dirname, "..", "sql", "schema.sql"), "utf8");
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log("Schéma appliqué avec succès sur bluerick.");
  } catch (e) {
    console.error("Erreur SQL :", e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
