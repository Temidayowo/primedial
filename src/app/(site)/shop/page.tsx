import Header from "@/components/header";
import ShopContent from "./shopContent";

const ShopPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <Header
        theme="dark"
        className="bg-transparent absolute"
        mobileClassName="bg-transparent absolute top-0 left-0 z-50 w-full border-b-0"
      />
      <ShopContent searchParams={resolvedSearchParams} />
    </>
  );
};

export default ShopPage;
