import Link from "next/link";
import { RecipeForm } from "./recipe-form";

export default function NewRecipePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ný uppskrift</h1>
        <Link
          href="/admin/logout"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Skrá út
        </Link>
      </div>
      <RecipeForm />
    </div>
  );
}
