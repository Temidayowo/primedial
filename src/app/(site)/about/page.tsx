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
      <Header theme="dark" />
      <AboutContent />
    </>
  );
};

export default AboutPage;
