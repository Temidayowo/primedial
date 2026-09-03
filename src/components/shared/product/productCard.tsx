import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SurveyingProduct } from "@/data/products";
import { Button } from "@base-ui/react";

const ProductCard = ({ product }: { product: SurveyingProduct }) => {
  return (
    // 1. Added `h-full flex flex-col` so the card spans the full grid height and stacks contents
    <Card className="bg-[#F8FAFC] ring-0 rounded-lg shadow hover:shadow-lg duration-300 transition-transform ease-in-out hover:scale-102 mx-0 h-full flex flex-col">
      <CardHeader>
        <Link href={`/products/${product.slug}`} className="block">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={200}
            loading="eager"
            className="w-full h-64 md:h-44 object-cover object-center"
          />
        </Link>
      </CardHeader>

      {/* 2. Added `flex flex-col flex-grow` to allow the content area to fill all empty space */}
      <CardContent className="mt-2 flex flex-col grow">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-clash-display text-base font-medium text-blue">
            {product.name}
          </h3>
          <p className="mt-1 font-poppins text-xs font-medium text-green">
            {product.brand}
          </p>
          <p className="text-[11px] font-extralight text-muted-foreground font-poppins mt-2 truncate">
            {product.description}
          </p>
        </Link>

        {/* 3. Replaced `mt-4` with `mt-auto pt-4`. `mt-auto` pushes this div to the very bottom. */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="text-base font-poppins font-bold text-blue">
            {product.inStock ? `₦${product.price.toFixed(2)}` : "Out of Stock"}
          </p>

          <Button className="font-poppins text-sm bg-green hover:bg-blue transition-colors duration-300 text-white px-4 py-2 rounded-full">
            {product.inStock ? "Add to Cart" : "Get Quote"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
