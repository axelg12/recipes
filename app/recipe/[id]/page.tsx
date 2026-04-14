import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/recipes";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  const categoryName =
    recipe.mainIngredient.charAt(0).toUpperCase() +
    recipe.mainIngredient.slice(1);

  return (
    <div>
      <Link
        href={`/category/${recipe.mainIngredient}`}
        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        &larr; {categoryName}
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{recipe.name}</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {recipe.description}
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
          {recipe.ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          {recipe.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
