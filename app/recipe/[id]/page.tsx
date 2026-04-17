import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/recipes";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderWithLinks(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [full, label, href] = match;
    const start = match.index ?? 0;
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }
    parts.push(
      <Link
        key={key++}
        href={href}
        className="text-blue-600 hover:underline dark:text-blue-400"
      >
        {label}
      </Link>
    );
    lastIndex = start + full.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

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

      {recipe.image && (
        <Image
          src={recipe.image}
          alt={recipe.name}
          width={0}
          height={0}
          sizes="(max-width: 640px) 100vw, 640px"
          className="mt-6 w-full max-w-xl h-auto rounded-lg"
        />
      )}

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
            <li key={i}>{renderWithLinks(step)}</li>
          ))}
        </ol>
      </section>

      {recipe.notes && (
        <blockquote className="mt-8 border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2 text-gray-600 dark:text-gray-400 italic">
          {renderWithLinks(recipe.notes)}
        </blockquote>
      )}
    </div>
  );
}
