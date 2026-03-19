# BLUERICK

Site **Next.js** au style **cyberpunk** pour répertorier des **plans de construction d’imprimantes 3D**, branché sur **PostgreSQL** (`localhost:5432/bluerick`).

## Prérequis

- Node.js 18+
- PostgreSQL avec une base nommée `bluerick`

## Configuration

1. Copiez `.env.example` vers `.env.local` et adaptez `DATABASE_URL` (utilisateur / mot de passe réels).

2. Créez les tables et insérez des exemples :

```bash
npm install
npm run db:setup
npm run db:seed
```

Vous pouvez aussi exécuter manuellement `sql/schema.sql` dans votre client SQL (pgAdmin, psql, etc.).

## Lancer le site

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## API

- `GET /api/plans` — liste (query : `q`, `type`, `difficulty`)
- `GET /api/plans/[slug]` — détail d’un plan

## Stack

- Next.js 14 (App Router), React, TypeScript
- Tailwind CSS (thème néon / grille / scanlines)
- `pg` pour PostgreSQL

## Licence du projet

Code du site : à votre convenance. Les **plans et marques cités** restent la propriété de leurs auteurs ; vérifiez toujours les licences sur les sites sources.
