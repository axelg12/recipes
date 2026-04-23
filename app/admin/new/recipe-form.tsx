"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const fieldClass =
  "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

const labelClass =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

export function RecipeForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
      mainIngredient: String(data.get("mainIngredient") ?? "").trim(),
      ingredients: splitLines(String(data.get("ingredients") ?? "")),
      instructions: splitLines(String(data.get("instructions") ?? "")),
      image: String(data.get("image") ?? "").trim() || undefined,
      notes: String(data.get("notes") ?? "").trim() || undefined,
    };

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        router.push("/admin/login?next=/admin/new");
        return;
      }

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? `Villa: ${res.status}`);
        return;
      }

      const recipe = (await res.json()) as { id: string };
      router.push(`/recipe/${recipe.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eitthvað fór úrskeiðis");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClass}>
          Nafn
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Lýsing
        </label>
        <input
          id="description"
          name="description"
          type="text"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="mainIngredient" className={labelClass}>
          Flokkur / aðalhráefni
        </label>
        <input
          id="mainIngredient"
          name="mainIngredient"
          type="text"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="ingredients" className={labelClass}>
          Hráefni{" "}
          <span className="text-gray-500 font-normal">(ein lína hvert)</span>
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          rows={6}
          required
          className={`${fieldClass} font-mono text-sm`}
        />
      </div>

      <div>
        <label htmlFor="instructions" className={labelClass}>
          Aðferð{" "}
          <span className="text-gray-500 font-normal">(ein lína hvert)</span>
        </label>
        <textarea
          id="instructions"
          name="instructions"
          rows={8}
          required
          className={`${fieldClass} font-mono text-sm`}
        />
      </div>

      <div>
        <label htmlFor="image" className={labelClass}>
          Mynd{" "}
          <span className="text-gray-500 font-normal">
            (slóð, t.d. /recipes/foo.png)
          </span>
        </label>
        <input id="image" name="image" type="text" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Athugasemdir
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className={fieldClass}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 font-medium hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Vista…" : "Vista uppskrift"}
      </button>
    </form>
  );
}
