import Mission from "@/components/about/mission";
import Story from "@/components/about/story";
import Team from "@/components/about/team";
import { PageHero } from "@/components/ui/pageHero";

const AboutContent = () => {
  return (
    <>
      <PageHero
        heading="About Us"
        subheading="Our mission, vision, and the story behind the association."
        breadcrumb="Home / About"
        backgroundImage="/images/about-hero.jpg"
      />
      <Story />
    <Mission />
    <Team />
    </>
  );
};

export default AboutContent;
