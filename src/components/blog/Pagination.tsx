import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  category?: string;
  serie?: string;
}

function buildUrl(
  p: number,
  category?: string,
  serie?: string,
): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (serie) params.set("serie", serie);
  if (p >= 2) params.set("page", String(p));
  const qs = params.toString();
  return `/blog${qs ? `?${qs}` : ""}`;
}

function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");

  pages.push(total);
  return pages;
}

export default function Pagination({
  page,
  totalPages,
  category,
  serie,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = getPageRange(page, totalPages);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Paginação"
      className="mt-12 flex items-center justify-center gap-1"
    >
      {hasPrev ? (
        <Link
          href={buildUrl(page - 1, category, serie)}
          className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-ink-2 transition-colors hover:bg-slate-100 hover:text-ink"
        >
          ← Anterior
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-muted opacity-40"
        >
          ← Anterior
        </span>
      )}

      <div className="flex items-center gap-1">
        {range.map((item, i) =>
          item === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-muted"
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={buildUrl(item, category, serie)}
              aria-current={item === page ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                item === page
                  ? "bg-brand-500 text-white"
                  : "text-ink-2 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              {item}
            </Link>
          ),
        )}
      </div>

      {hasNext ? (
        <Link
          href={buildUrl(page + 1, category, serie)}
          className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-ink-2 transition-colors hover:bg-slate-100 hover:text-ink"
        >
          Próxima →
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-muted opacity-40"
        >
          Próxima →
        </span>
      )}
    </nav>
  );
}
