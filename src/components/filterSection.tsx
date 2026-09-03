"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface FilterSectionProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
  }[];
  brands: {
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
  }[];
}

const FilterSection = ({ brands, categories }: FilterSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterFormRef = useRef<HTMLFormElement>(null);

  // Get currently selected filters from the URL so checkboxes stay checked on refresh
  const currentCategories = searchParams.getAll("category");
  const currentBrands = searchParams.getAll("brand");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Extract all checked values
    const selectedCategories = formData.getAll("category");
    const selectedBrands = formData.getAll("brand");

    // Construct the new URL query string
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear old filters first
    params.delete("category");
    params.delete("brand");

    // Append newly selected filters
    selectedCategories.forEach((c) => params.append("category", c as string));
    selectedBrands.forEach((b) => params.append("brand", b as string));

    // Update the URL. { scroll: false } prevents the page from jumping to the top
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    filterFormRef.current?.reset();
    
    // Create new params, preserve other non-filter params (like pagination if you have it)
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("brand");
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <form ref={filterFormRef} onSubmit={handleSubmit} className="w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-blue font-clash-display text-lg font-semibold">
          Filter
        </h3>
        <Button
          type="button"
          variant="ghost" // Changed to ghost or unstyled so it doesn't look like the primary action
          className="font-poppins font-light p-0 h-auto hover:bg-transparent"
          onClick={handleClearAll}
        >
          Clear all
        </Button>
      </div>
      
      <div className="mt-6">
        <h4 className="uppercase font-poppins text-sm font-semibold">
          Category
        </h4>
        <div className="mt-4 flex flex-col gap-2">
          {categories.map((category) => (
            <div key={category.id} className="flex justify-between">
              <label className="flex gap-3 items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="category" // MUST HAVE THIS for FormData to work
                  value={category.slug}
                  defaultChecked={currentCategories.includes(category.slug)}
                  className="size-4 accent-blue"
                />
                <p className="font-poppins font-normal text-sm">
                  {category.name}
                </p>
              </label>
              <p className="font-poppins text-[11px] text-gray-500">
                ({category._count.products})
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="uppercase font-poppins text-sm font-semibold">Brand</h4>
        <div className="mt-4 flex flex-col gap-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex justify-between">
              <label className="flex gap-3 items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="brand" // MUST HAVE THIS for FormData to work
                  value={brand.slug}
                  defaultChecked={currentBrands.includes(brand.slug)}
                  className="size-4 accent-blue"
                />
                <p className="font-poppins font-normal text-sm">{brand.name}</p>
              </label>
              <p className="font-poppins text-[11px] text-gray-500">
                ({brand._count.products})
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full flex justify-center mt-6">
        {/* Changed to type="submit" so it triggers the form's onSubmit event */}
        <Button type="submit" className="bg-blue py-5 text-white w-full">
          Apply Filters
        </Button>
      </div>
    </form>
  );
};

export default FilterSection;