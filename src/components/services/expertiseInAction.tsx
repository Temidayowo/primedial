import WorkCard from "./workCard";

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
      name: "GREENWICH GARDENS PHASE I & II",
      about:
        "Construction & Engineering - Real Estate Layout, Setting Out, Piling, Layout, Topographical Survey",
      location: "KOSOFE, Lagos",
      image: "/images/shop-section.jpg",
    },
    {
      id: 3,
      name: "GREENWICH GARDENS PHASE I & II",
      about:
        "Construction & Engineering - Real Estate Layout, Setting Out, Piling, Layout, Topographical Survey",
      location: "KOSOFE, Lagos",
      image: "/images/shop-section.jpg",
    },
    {
      id: 4,
      name: "GREENWICH GARDENS PHASE I & II",
      about:
        "Construction & Engineering - Real Estate Layout, Setting Out, Piling, Layout, Topographical Survey",
      location: "KOSOFE, Lagos",
      image: "/images/shop-section.jpg",
    },
  ];

  return (
    <section>
      <div className="section-container">
        <h4 className="text-green uppercase font-semibold text-sm">Our Work</h4>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue">
          Expertise In Action
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              image={work.image}
              name={work.name}
              about={work.about}
              location={work.location}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseInAction;
