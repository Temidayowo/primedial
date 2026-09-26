"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import type { ProductFormState } from "@/lib/actions/admin/products.action";

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-blue placeholder:text-slate-400 focus:border-blue-500 focus:outline-none";
const labelClasses = "text-xs font-medium tracking-wide text-slate-500 uppercase";

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  images: string[];
  features: string[];
  specSheetUrl?: string | null;
  weightKg?: number | null;
  lengthCm?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
  inStock: boolean;
  isFeatured: boolean;
}

export function ProductForm({
  action,
  product,
  categories,
  brands,
  submitLabel,
}: {
  action: (
    prevState: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  product?: ProductFormValues;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [images, setImages] = useState<string[]>(
    product?.images?.length ? product.images : [""],
  );
  const [features, setFeatures] = useState<string[]>(
    product?.features?.length ? product.features : [""],
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <label className={labelClasses}>Name</label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className={`mt-1.5 ${inputClasses}`}
        />
        {state?.errors?.name && (
          <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className={`mt-1.5 ${inputClasses}`}
        />
        {state?.errors?.description && (
          <p className="mt-1 text-xs text-red-500">{state.errors.description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Price (₦)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price}
            className={`mt-1.5 ${inputClasses}`}
          />
          {state?.errors?.price && (
            <p className="mt-1 text-xs text-red-500">{state.errors.price[0]}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>Spec Sheet URL (optional)</label>
          <input
            name="specSheetUrl"
            defaultValue={product?.specSheetUrl ?? ""}
            className={`mt-1.5 ${inputClasses}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Category</label>
          <select
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? ""}
            className={`mt-1.5 ${inputClasses}`}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {state?.errors?.categoryId && (
            <p className="mt-1 text-xs text-red-500">{state.errors.categoryId[0]}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>Brand</label>
          <select
            name="brandId"
            required
            defaultValue={product?.brandId ?? ""}
            className={`mt-1.5 ${inputClasses}`}
          >
            <option value="" disabled>
              Select a brand
            </option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {state?.errors?.brandId && (
            <p className="mt-1 text-xs text-red-500">{state.errors.brandId[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Shipping (packed)</label>
        <p className="mt-1 text-xs text-slate-400">
          Boxed weight and dimensions, used for courier quotes and bookings.
        </p>
        <div className="mt-1.5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              ["weightKg", "Weight (kg)"],
              ["lengthCm", "Length (cm)"],
              ["widthCm", "Width (cm)"],
              ["heightCm", "Height (cm)"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <input
                name={field}
                type="number"
                step="0.01"
                min="0"
                placeholder={label}
                aria-label={label}
                defaultValue={product?.[field] ?? ""}
                className={inputClasses}
              />
              {state?.errors?.[field] && (
                <p className="mt-1 text-xs text-red-500">{state.errors[field][0]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Images</label>
        <p className="mt-1 text-xs text-slate-400">
          Paths under /public (e.g. /images/products/example.jpg) or full URLs.
        </p>
        <div className="mt-1.5 space-y-2">
          {images.map((value, index) => (
            <div key={index} className="flex gap-2">
              <input
                name="images"
                value={value}
                onChange={(e) =>
                  setImages((prev) =>
                    prev.map((v, i) => (i === index ? e.target.value : v)),
                  )
                }
                placeholder="/images/products/example.jpg"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                disabled={images.length === 1}
                className="shrink-0 rounded-lg border border-slate-200 p-2.5 text-slate-400 hover:text-red-500 disabled:opacity-40"
                aria-label="Remove image"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setImages((prev) => [...prev, ""])}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
        >
          <Plus className="size-3.5" /> Add image
        </button>
        {state?.errors?.images && (
          <p className="mt-1 text-xs text-red-500">{state.errors.images[0]}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Features</label>
        <div className="mt-1.5 space-y-2">
          {features.map((value, index) => (
            <div key={index} className="flex gap-2">
              <input
                name="features"
                value={value}
                onChange={(e) =>
                  setFeatures((prev) =>
                    prev.map((v, i) => (i === index ? e.target.value : v)),
                  )
                }
                placeholder="e.g. Centimeter-level accuracy"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() =>
                  setFeatures((prev) => prev.filter((_, i) => i !== index))
                }
                disabled={features.length === 1}
                className="shrink-0 rounded-lg border border-slate-200 p-2.5 text-slate-400 hover:text-red-500 disabled:opacity-40"
                aria-label="Remove feature"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFeatures((prev) => [...prev, ""])}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
        >
          <Plus className="size-3.5" /> Add feature
        </button>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-blue">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={product?.inStock ?? true}
            className="size-4 rounded border-slate-300"
          />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-sm text-blue">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.isFeatured ?? false}
            className="size-4 rounded border-slate-300"
          />
          Featured
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
