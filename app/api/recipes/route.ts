import { addRecipe } from "@/lib/recipes";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, description, mainIngredient, ingredients, instructions } =
    body as Record<string, unknown>;

  const missing: string[] = [];
  if (!name || typeof name !== "string") missing.push("name");
  if (!description || typeof description !== "string")
    missing.push("description");
  if (!mainIngredient || typeof mainIngredient !== "string")
    missing.push("mainIngredient");
  if (!Array.isArray(ingredients) || ingredients.length === 0)
    missing.push("ingredients");
  if (!Array.isArray(instructions) || instructions.length === 0)
    missing.push("instructions");

  if (missing.length > 0) {
    return Response.json(
      { error: `Missing or invalid fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const recipe = addRecipe({
    name: name as string,
    description: description as string,
    mainIngredient: mainIngredient as string,
    ingredients: ingredients as string[],
    instructions: instructions as string[],
  });

  return Response.json(recipe, { status: 201 });
}
