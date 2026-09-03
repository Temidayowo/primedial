"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-3 items-center">
      <label htmlFor="sort" className="text-sm font-edium text-gray-700">
        Sort By
      </label>
      <select
        id="sort"
        className="border border-gray-300 rounded-md p-2 bg-white text-sm focus:ring-2 focus:ring-blue outline-none cursor-pointer"
        defaultValue={searchParams.get("sort") ?? "newest"}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="newest">Newest Arrivals</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
