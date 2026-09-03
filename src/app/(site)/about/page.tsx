import { Metadata } from "next";
import AboutContent from "./aboutContent";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Primedial Solutions.",
};

const AboutPage = () => {
  return (
    <>
      <Header
        theme="dark"
        mobileClassName="absolute top-0 left-0 z-50 w-full bg-transparent  border-b-0"
      />
      <AboutContent />
    </>
  );
};

export default AboutPage;
