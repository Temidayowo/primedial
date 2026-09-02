import TeamCard from "@/components/teamCard";
// Adjust this import path to match your animation wrapper file
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const Team = () => {
  return (
    // Added py-16 to ensure proper spacing if it wasn't handled in your global section-container class
    <section className="bg-gray-50 py-16 md:py-20 overflow-hidden">
      {/* Wrap the entire section content in StaggerContainer so the title and cards animate sequentially */}
      <StaggerContainer className="section-container">
        {/* Animate the title first */}
        <StaggerItem>
          <h2 className="font-clash-display text-blue text-2xl md:text-3xl lg:text-4xl font-bold">
            Meet Our Team
          </h2>
        </StaggerItem>

        {/* Animate each card one by one in the grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          <StaggerItem>
            <TeamCard />
          </StaggerItem>

          <StaggerItem>
            <TeamCard />
          </StaggerItem>

          <StaggerItem>
            <TeamCard />
          </StaggerItem>

          <StaggerItem>
            <TeamCard />
          </StaggerItem>
        </div>
      </StaggerContainer>
    </section>
  );
};

export default Team;
