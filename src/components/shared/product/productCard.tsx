import Image from "next/image";

import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { SurveyingProduct } from "@/data/products"; // Don't forget to import the type
import { Button } from "@base-ui/react";

// Properly destructure { product } from the props object

const ProductCard = ({ product }: { product: SurveyingProduct }) => {
  return (
    <Card className="bg-[#F8FAFC] ring-0 rounded-lg shadow hover:shadow-lg duration-300 transition-transform ease-in-out hover:scale-102 mx-0">
      <CardHeader>
        <Link href={`/products/${product.slug}`} className="block">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={300}
            height={200}
            // Added w-full and h-[200px] below

            className="w-full h-50 object-cover object-center"
          />
        </Link>
      </CardHeader>
      <CardContent className="mt-2">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-clash-display text-base font-medium text-blue">
            {product.name}
          </h3>
          <p className="text-[11px] font-extralight text-muted-foreground font-poppins mt-2 truncate">
            {product.description}
          </p>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          {/* Check inStock to toggle Price vs "Out of Order" */}
          <p className="text-lg font-poppins font-bold text-blue">
            {product.inStock ? `₦${product.price.toFixed(2)}` : "Out of Order"}
          </p>

          <Button className="font-poppins text-sm bg-green hover:bg-blue transition-colors duration-300 text-white px-4 py-2 rounded-full">
            {/* Check inStock to toggle button text */}
            {product.inStock ? "Add to Cart" : "Get Quote"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
