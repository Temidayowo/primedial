import { PageHero } from "@/components/ui/pageHero";

const ShopContent = () => {
  return (
    <>
      <PageHero
        heading="Surveying Equipment"
        subheading="Precision instruments engineered for the field, backed by expert support and industry-leading warranties."
        breadcrumb="Home/Shop"
        backgroundImage="/images/shop-section.jpg"
        align="left"
        className="px-32 py-20"
      />
    </>
  );
};

export default ShopContent;
