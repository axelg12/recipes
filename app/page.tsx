import Link from "next/link";
import { getCategories } from "@/lib/recipes";

export default function Home() {
  const categories = getCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Uppskriftir Axels</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Helstu uppskriftirnar sem ég hef sankað að mér en man ekki alltaf
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group block rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            <h2 className="text-lg font-semibold group-hover:underline">
              {category.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {category.count}{" "}
              {category.count === 1 ? "Uppskrift" : "Uppskriftir"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
