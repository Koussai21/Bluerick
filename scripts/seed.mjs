import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
config();

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/bluerick";

const samples = [
  {
    slug: "voron-2-4",
    title: "Voron 2.4",
    description:
      "Imprimante CoreXY haute performance, cadre entièrement imprimé ou profilés, volume ~350³ mm typique.",
    printer_type: "CoreXY",
    difficulty: "Avancé",
    author: "Voron Design",
    source_url: "https://vorondesign.com/voron2.4",
    repo_url: "https://github.com/VoronDesign/Voron-2",
    image_url:
      "https://images.unsplash.com/photo-1631541906991-9c26b84c10d7?w=800&q=80",
    tags: ["open-source", "CoreXY", "enclosure"],
    featured: true,
  },
  {
    slug: "rat-rig-v-core-3",
    title: "Rat Rig V-Core 3",
    description:
      "Kit CoreXY modulaire, rails linéaires, grande stabilité pour impressions rapides.",
    printer_type: "CoreXY",
    difficulty: "Intermédiaire",
    author: "Rat Rig",
    source_url: "https://www.ratrig.com/",
    repo_url: null,
    image_url:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    tags: ["kit", "CoreXY"],
    featured: true,
  },
  {
    slug: "prusa-mk3s-plus",
    title: "Prusa i3 MK3S+ (inspiration open)",
    description:
      "Architecture cartésienne classique, nombreux dérivés et améliorations communautaires.",
    printer_type: "Cartésien",
    difficulty: "Débutant",
    author: "Prusa Research / communauté",
    source_url: "https://www.prusa3d.com/",
    repo_url: null,
    image_url:
      "https://images.unsplash.com/photo-1612815154858-60aa4c43e64e?w=800&q=80",
    tags: ["cartésien", "fiable"],
    featured: false,
  },
  {
    slug: "ender-3-upgrades",
    title: "Ender 3 — plans d'amélioration",
    description:
      "Compilation de mods : supports, guides câbles, extrudeur direct drive, silent board.",
    printer_type: "Cartésien",
    difficulty: "Débutant",
    author: "Communauté",
    source_url: "https://www.thingiverse.com/",
    repo_url: null,
    image_url:
      "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80",
    tags: ["mod", "budget"],
    featured: false,
  },
  {
    slug: "blv-mgn-cube",
    title: "BLV mgn Cube",
    description:
      "Cube cartésien sur rails MGN, châssis rigide et impressions précises.",
    printer_type: "Cartésien",
    difficulty: "Intermédiaire",
    author: "BLV",
    source_url: "https://www.blvprojects.com/blv-mgn-cube-3d-printer",
    repo_url: null,
    image_url:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    tags: ["rails", "cube"],
    featured: true,
  },
];

async function main() {
  const pool = new pg.Pool({ connectionString });
  const client = await pool.connect();
  try {
    for (const p of samples) {
      await client.query(
        `INSERT INTO plans (slug, title, description, printer_type, difficulty, author, source_url, repo_url, image_url, tags, featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           printer_type = EXCLUDED.printer_type,
           difficulty = EXCLUDED.difficulty,
           author = EXCLUDED.author,
           source_url = EXCLUDED.source_url,
           repo_url = EXCLUDED.repo_url,
           image_url = EXCLUDED.image_url,
           tags = EXCLUDED.tags,
           featured = EXCLUDED.featured`,
        [
          p.slug,
          p.title,
          p.description,
          p.printer_type,
          p.difficulty,
          p.author,
          p.source_url,
          p.repo_url,
          p.image_url,
          p.tags,
          p.featured,
        ],
      );
    }
    console.log(`${samples.length} plans insérés / mis à jour.`);
  } catch (e) {
    console.error("Erreur seed :", e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
