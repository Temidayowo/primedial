import WorkCard from "./workCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const ExpertiseInAction = () => {
  const works = [
    {
      id: 1,
      name: "GREENWICH GARDENS PHASE I & II",
      about:
        "Construction & Engineering - Real Estate Layout, Setting Out, Piling, Layout, Topographical Survey",
      location: "KOSOFE, Lagos",
      image: "/images/shop-section.jpg",
    },
    {
      id: 2,
      name: "OFFSHORE PLATFORM POSITIONING SURVEY",
      about:
        "Oil & Gas - Offshore Positioning & Marine Construction Support",
      location: "BONNY, Rivers State",
      image: "/images/shop-section.jpg",
      isExample: true,
    },
    {
      id: 3,
      name: "ESTATE LAND DOCUMENTATION & TITLING",
      about:
        "Cadastral - Land Documentation, Charting & Layout Survey",
      location: "EPE, Lagos",
      image: "/images/shop-section.jpg",
      isExample: true,
    },
    // {
    //   id: 4,
    //   name: "PIPELINE CORRIDOR ROUTE SURVEY",
    //   about:
    //     "Aerial / Drone - Route Alignment & Right-of-Way Mapping",
    //   location: "Ogun State",
    //   image: "/images/shop-section.jpg",
    //   isExample: true,
    // },
  ];

  return (
    <section className="bg-gray-100 overflow-hidden">
      <StaggerContainer className="section-container">
        <StaggerItem>
          <h4 className="text-green uppercase font-semibold text-sm text-center">
            Our Work
          </h4>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue text-center font-clash-display">
            Expertise In Action
          </h2>
        </StaggerItem>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {works.map((work) => (
            <StaggerItem key={work.id}>
              <WorkCard
                image={work.image}
                name={work.name}
                about={work.about}
                location={work.location}
                isExample={work.isExample}
              />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
};

export default ExpertiseInAction;
