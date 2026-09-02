import {Metadata} from "next";
import AboutContent from "./aboutContent";  

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about Primedial Solutions.",
}

const AboutPage = () => {
  return (
    <>
      <AboutContent />
    </>
  );
};

export default AboutPage;
