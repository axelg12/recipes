import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipesByCategory } from "@/lib/recipes";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipes = getRecipesByCategory(slug);

  if (recipes.length === 0) {
    notFound();
  }

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div>
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        &larr; All categories
      </Link>

      <h1 className="mt-4 text-3xl font-bold mb-2">{categoryName}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
      </p>

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipe/${recipe.id}`}
            className="group block rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            <h2 className="text-lg font-semibold group-hover:underline">
              {recipe.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {recipe.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
