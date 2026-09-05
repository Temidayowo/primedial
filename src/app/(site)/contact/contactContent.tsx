import Faq from "@/components/contact/faq"
import MessageSection from "@/components/contact/messageSection";
import { PageHero } from "@/components/ui/pageHero";

const ContactPageContent = () => {
  return (
    <>
      <PageHero
        heading="Contact Prime Dial Solutions"
        subheading="Questions about a product, a bulk order, or need technical support? Our team responds within one business day."
        breadcrumb="Home / Contact"
        backgroundImage="/images/about-hero.jpg"
      />
      <MessageSection />
      <Faq />
    </>
  );
};

export default ContactPageContent;
