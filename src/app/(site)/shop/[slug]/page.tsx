import Header from "@/components/header";
import AboutProduct from "@/components/productDiscription/aboutProduct";
import { getProductsBySlug } from "@/lib/actions/products.action";
import Link from "next/link";
import { notFound } from "next/navigation";

const ProductDescriptionPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductsBySlug(slug);

  if (!product) notFound();

  const categoryLabel = product.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <>
      <Header theme="dark" className="relative bg-blue text-white"
      mobileClassName="bg-blue" />
      <nav
        aria-label="Breadcrumb"
        className="border-b border-gray-200 bg-gray-50"
      >
        <ol className="section-container flex items-center gap-2 py-4 text-sm font-poppins text-gray-500">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-blue hover:underline"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">{">"}</li>
          <li>
            <Link
              href="/shop"
              className="transition-colors hover:text-blue hover:underline"
            >
              Shop
            </Link>
          </li>
          <li aria-hidden="true">{">"}</li>
          <li>
            <Link
              href={`/shop?category=${encodeURIComponent(product.category)}`}
              className="transition-colors hover:text-blue hover:underline"
            >
              {categoryLabel}
            </Link>
          </li>
          <li aria-hidden="true">{">"}</li>
          <li>
            <p className="font-medium text-blue">{product.name}</p>
          </li>
        </ol>
      </nav>
      <AboutProduct product={product} />
    </>
  );
};

export default ProductDescriptionPage;
