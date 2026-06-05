"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface BlogFiltersProps {
  categories: string[];
  series: string[];
  activeCategory?: string;
  activeSerie?: string;
}

export default function BlogFilters({
  categories,
  series,
  activeCategory,
  activeSerie,
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            !activeCategory
              ? "bg-brand-500 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-brand-100 hover:text-brand-700"
          }`}
          onClick={() => setFilter("category", null)}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === cat
                ? "bg-brand-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-brand-100 hover:text-brand-700"
            }`}
            onClick={() =>
              setFilter("category", activeCategory === cat ? null : cat)
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {series.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-1 text-xs font-semibold tracking-wide text-muted">
            SÉRIES:
          </span>
          {series.map((s) => (
            <button
              key={s}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeSerie === s
                  ? "bg-brand-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-brand-100 hover:text-brand-700"
              }`}
              onClick={() => setFilter("serie", activeSerie === s ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
