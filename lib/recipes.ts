import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { getKv } from "./kv";

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

const RECIPE_PREFIX = ["recipe"] as const;
const recipeKey = (id: string) => [...RECIPE_PREFIX, id];

function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

export async function getRecipes(): Promise<Recipe[]> {
  const kv = await getKv();
  const recipes: Recipe[] = [];
  for await (const entry of kv.list<Recipe>({ prefix: [...RECIPE_PREFIX] })) {
    recipes.push(entry.value);
  }
  return recipes;
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  const recipes = await getRecipes();
  return recipes.filter(
    (r) => r.mainIngredient.toLowerCase() === category.toLowerCase(),
  );
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const kv = await getKv();
  const entry = await kv.get<Recipe>(recipeKey(id));
  return entry.value ?? undefined;
}

export async function getCategories(): Promise<Category[]> {
  const recipes = await getRecipes();
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

export async function addRecipe(data: {
  name: string;
  description: string;
  mainIngredient: string;
  ingredients: string[];
  instructions: string[];
}): Promise<Recipe> {
  const kv = await getKv();

  const base = toSlug(data.name);
  let id = base;
  let suffix = 2;
  while ((await kv.get<Recipe>(recipeKey(id))).value !== null) {
    id = `${base}-${suffix}`;
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

  await kv.set(recipeKey(id), recipe);

  revalidatePath("/");
  revalidatePath(`/category/${recipe.mainIngredient}`);

  return recipe;
}
