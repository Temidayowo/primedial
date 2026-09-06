import Image from "next/image";
import { FaFileArrowDown } from "react-icons/fa6";
import { Product } from "@/app/(site)/shop/productList";
import Counter from "../counter";
import { Button } from "../ui/button";

const AboutProduct = ({
  product,
}: {
  product: Pick<
    Product,
    "name" | "images" | "category" | "price" | "description" | "specSheetUrl"
  >;
}) => {
  return (
    <section className="bg-gray-50">
      <div className="section-container grid grid-cols-1 gap-16 md:grid-cols-2">
        <div className=" bg-gray-100 relative aspect-square border-[0.1px] border-gray-300 rounded-xl overflow-hidden group">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover scale-85 group-hover:scale-100 transition duration-300 ease-in-out"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="uppercase text-green font-semibold font-clash-display ">
            {product.category}
          </h3>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-blue font-bold font-clash-display">
            {product.name}
          </h1>
          <h2 className="text-xl md:text-2xl lg:3xl font-semibold font-poppins">
            ₦{product.price}
          </h2>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex gap-6 items-center">
            <Counter />
            <Button className="bg-blue lg:bg-blue/90 hover:bg-blue text-white flex-1 py-6 rounded-2xl cursor-pointer">
              Add to Cart
            </Button>
          </div>
          <a
            href={product.specSheetUrl}
            download
            className="inline-flex gap-1.5 py-4 items-center justify-center rounded-lg bg-transparent text-sm font-medium text-blue border border-blue duration-300 transition-colors hover:bg-blue/90 hover:text-white"
          >
            <FaFileArrowDown className="text-lg"></FaFileArrowDown>
            Download Spec Sheet
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutProduct;
