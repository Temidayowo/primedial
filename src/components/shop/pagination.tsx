import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { pageNumbers } from "@/lib/pagination";

type SearchParams = Record<string, string | string[] | undefined>;

// Links back to the shop with every current filter and sort kept, only
// the page changed. Page 1 drops the parameter. The #products anchor
// brings the visitor back to the top of the grid, not the page hero.
function pageHref(searchParams: SearchParams, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page" || value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) params.append(key, v);
  }
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/shop${query ? `?${query}` : ""}#products`;
}

const baseItem =
  "flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors duration-300";

export function ShopPagination({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: SearchParams;
}) {
  if (pageCount <= 1) return null;

  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  return (
    <nav aria-label="Product pages" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {hasPrevious ? (
        <Link
          href={pageHref(searchParams, page - 1)}
          rel="prev"
          className={cn(baseItem, "gap-1 border border-gray-200 bg-white text-blue hover:border-blue")}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(baseItem, "cursor-not-allowed gap-1 border border-gray-100 bg-white text-slate-300")}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {pageNumbers(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : item === page ? (
          <span key={item} aria-current="page" className={cn(baseItem, "bg-blue text-white")}>
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(searchParams, item)}
            aria-label={`Page ${item}`}
            className={cn(baseItem, "border border-gray-200 bg-white text-blue hover:border-green hover:text-green")}
          >
            {item}
          </Link>
        ),
      )}

      {hasNext ? (
        <Link
          href={pageHref(searchParams, page + 1)}
          rel="next"
          className={cn(baseItem, "gap-1 border border-gray-200 bg-white text-blue hover:border-blue")}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(baseItem, "cursor-not-allowed gap-1 border border-gray-100 bg-white text-slate-300")}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
