@AGENTS.md

# Recipes app — quick map

Personal recipe site. Axel's own cookbook. Some recipe content is in Icelandic — that's intentional; preserve it. UI chrome, code, and schema stay English.

## Stack

- **Next.js 16.2.3** — this version has breaking changes from older Next.js docs. Route handlers receive `params: Promise<{…}>` (see `app/recipe/[id]/page.tsx`, `app/category/[slug]/page.tsx`). When in doubt, read the relevant guide under `node_modules/next/dist/docs/` before writing route code.
- React 19, TypeScript (strict), Tailwind v4 via `@import "tailwindcss"` in `app/globals.css`.
- Geist Sans + Geist Mono from `next/font/google`.
- Package manager: **pnpm**.

## Data model

All recipes live in a single JSON array: `data/recipes.json`. No database.

`Recipe` interface is defined in `lib/recipes.ts`:

- `id` — lowercase slug; used as the URL segment.
- `name`, `description` — display text.
- `mainIngredient` — doubles as the category slug.
- `ingredients`, `instructions` — string arrays.
- `image?` — path under `/public/` (e.g. `/recipes/bbq.png`).
- `notes?` — free-form, rendered as a blockquote below the steps.
- `createdAt` — ISO timestamp.

Instructions may contain inline markdown links in the form `[label](/recipe/<id>)`; the detail page renders them as real `<Link>` components. Use this for cross-references between recipes.

## Categories

Categories are **derived**, not configured. `getCategories()` in `lib/recipes.ts` groups recipes by `mainIngredient.toLowerCase()`. To add a category, just add a recipe with a new `mainIngredient` value.

Category slugs are lowercase tokens (`chicken`, `tofu`, `sauces`, `drinks`, `eggs`, `protein`, …). Not every value has to be a literal ingredient — `sauces` and `drinks` are valid.

## Routes

- `/` — category grid (`app/page.tsx`)
- `/category/[slug]` — recipes in a category (`app/category/[slug]/page.tsx`)
- `/recipe/[id]` — recipe detail (`app/recipe/[id]/page.tsx`)
- `POST /api/recipes` — create a recipe (`app/api/recipes/route.ts`)

## Adding a recipe

Two options:

1. **API** — `POST /api/recipes` with `{name, description, mainIngredient, ingredients, instructions}`. The handler validates and slugifies. Does not yet accept `image` or `notes`.
2. **Direct edit** — append to `data/recipes.json`. Fine for bulk imports. Make sure `id` is unique and slug-shaped.

Slugs are produced by the [`slugify`](https://www.npmjs.com/package/slugify) npm package called with `{ lower: true, strict: true }`. It handles Icelandic characters (þ→th, ð→d, æ→ae, ó→o, …) out of the box.

## Conventions

- `@/*` path alias points at the repo root (`tsconfig.json`). Import as `import { getRecipes } from "@/lib/recipes"`.
- No test suite. No `test` script.
- Images live under `public/recipes/`; reference them as `/recipes/filename.png`.

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm start` — serve production build
- `pnpm lint` — ESLint
