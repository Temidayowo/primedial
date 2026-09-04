import { Metadata } from "next";
import Header from "@/components/header"
import ServicesContent from "./servicesContent"

export const metadata: Metadata = {
  title: "Services",
  description: "What we offer",
};

const ServicesPage = () => {
    return ( <>
    <Header
        theme="dark"
        className="bg-transparent absolute"
        mobileClassName="absolute top-0 left-0 z-50 w-full bg-transparent border-b-0"
      />
    <ServicesContent />
    </> );
}
 
export default ServicesPage;