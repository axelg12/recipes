import { readFileSync } from "node:fs";
import path from "node:path";
import { openKv } from "@deno/kv";
import type { Recipe } from "../lib/recipes.ts";

async function main() {
  const url = process.env.DENO_KV_URL ?? "./data/local-kv.sqlite";
  const target = url.startsWith("http") ? `remote KV at ${url}` : `local ${url}`;
  console.log(`Seeding ${target}`);

  const jsonPath = path.join(process.cwd(), "data", "recipes.json");
  const recipes = JSON.parse(readFileSync(jsonPath, "utf-8")) as Recipe[];

  const kv = await openKv(url);
  try {
    for (const recipe of recipes) {
      await kv.set(["recipe", recipe.id], recipe);
      console.log(`  set ${recipe.id}`);
    }
    console.log(`Done. Wrote ${recipes.length} recipes.`);
  } finally {
    kv.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
