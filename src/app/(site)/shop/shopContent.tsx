import {
  getBrands,
  getCategories,
  getProducts,
} from "@/lib/actions/products.action";
import { PageHero } from "@/components/ui/pageHero";
import FilterSection from "@/components/filterSection";
import ProductList from "@/app/(site)/shop/productList";

interface ShopContentProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ShopContent = async ({ searchParams }: ShopContentProps) => {
  // 1. Extract and normalize URL parameters into arrays
  const categoryParams = searchParams.category
    ? Array.isArray(searchParams.category)
      ? searchParams.category
      : [searchParams.category]
    : undefined;

  const brandParams = searchParams.brand
    ? Array.isArray(searchParams.brand)
      ? searchParams.brand
      : [searchParams.brand]
    : undefined;

  const sort =
    typeof searchParams.sort === "string" ? searchParams.sort : undefined;

  // 2. Fetch everything in parallel (Filters + Filtered Products)
  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(categoryParams, brandParams, sort),
  ]);

  console.log(products);

  return (
    <>
      <PageHero
        heading="Surveying Equipment"
        subheading="Precision instruments engineered for the field, backed by expert support and industry-leading warranties."
        breadcrumb="Home/Shop"
        backgroundImage="/images/shop-section.jpg"
        align="center"
      />

      <section className="bg-gray-100">
        {/* Added gap-8 so the sidebar and product grid don't touch */}
        <main className="section-container py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="border-[0.1px] border-blue rounded-xl bg-white py-8 px-4 col-span-1 lg:col-span-3 h-fit">
            <FilterSection categories={categories} brands={brands} />
          </aside>

          {/* Main Product Grid */}
          <div className="col-span-1 lg:col-span-9">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700">
                  No products found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <ProductList data={products} />
            )}
          </div>
        </main>
      </section>
    </>
  );
};

export default ShopContent;
