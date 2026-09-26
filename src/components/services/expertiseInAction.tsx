import WorkCard from "./workCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { getPublishedProjects } from "@/lib/content";

// Projects are managed in /admin/projects.
const ExpertiseInAction = async () => {
  const projects = await getPublishedProjects();

  if (projects.length === 0) return null;

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
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <WorkCard
                image={project.image}
                name={project.title}
                about={project.summary}
                location={project.location}
                year={project.year}
                isExample={project.isExample}
              />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
};

export default ExpertiseInAction;
