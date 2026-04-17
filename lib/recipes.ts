import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  mainIngredient: string;
  ingredients: string[];
  instructions: string[];
  image?: string;
  notes?: string;
  createdAt: string;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
}

const DATA_FILE = path.join(process.cwd(), "data", "recipes.json");

function readRecipes(): Recipe[] {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeRecipes(recipes: Recipe[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(recipes, null, 2));
}

function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

export function getRecipes(): Recipe[] {
  return readRecipes();
}

export function getRecipesByCategory(category: string): Recipe[] {
  return readRecipes().filter(
    (r) => r.mainIngredient.toLowerCase() === category.toLowerCase()
  );
}

export function getRecipeById(id: string): Recipe | undefined {
  return readRecipes().find((r) => r.id === id);
}

export function getCategories(): Category[] {
  const recipes = readRecipes();
  const map = new Map<string, number>();

  for (const r of recipes) {
    const key = r.mainIngredient.toLowerCase();
    map.set(key, (map.get(key) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([slug, count]) => ({
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function addRecipe(data: {
  name: string;
  description: string;
  mainIngredient: string;
  ingredients: string[];
  instructions: string[];
}): Recipe {
  const recipes = readRecipes();

  let id = toSlug(data.name);
  let suffix = 2;
  while (recipes.some((r) => r.id === id)) {
    id = `${toSlug(data.name)}-${suffix}`;
    suffix++;
  }

  const recipe: Recipe = {
    id,
    name: data.name,
    description: data.description,
    mainIngredient: data.mainIngredient.toLowerCase(),
    ingredients: data.ingredients,
    instructions: data.instructions,
    createdAt: new Date().toISOString(),
  };

  recipes.push(recipe);
  writeRecipes(recipes);

  revalidatePath("/");
  revalidatePath(`/category/${recipe.mainIngredient}`);

  return recipe;
}
