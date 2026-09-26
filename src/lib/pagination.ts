// Shop pagination. The page number lives in the URL (?page=2) so pages
// can be shared and bookmarked; page 1 has no parameter.
export const PRODUCTS_PER_PAGE = 15;

// "?page=abc", "?page=0" and a missing page all mean page 1.
export function parsePage(value: string | string[] | undefined) {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

// Page numbers to show, with "gap" where a run is skipped:
// 1 … 4 5 6 … 12. Always shows the first, last, and current +/- 1.
export function pageNumbers(current: number, pageCount: number): (number | "gap")[] {
  const wanted = new Set([1, pageCount, current - 1, current, current + 1]);
  const pages = [...wanted].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);

  const result: (number | "gap")[] = [];
  pages.forEach((page, i) => {
    const previous = pages[i - 1];
    if (previous !== undefined && page - previous === 2) result.push(previous + 1);
    else if (previous !== undefined && page - previous > 2) result.push("gap");
    result.push(page);
  });
  return result;
}
