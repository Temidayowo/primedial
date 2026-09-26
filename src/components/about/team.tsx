import TeamCard from "@/components/teamCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { getPublishedTeamMembers } from "@/lib/content";

// Team members are managed in /admin/team.
const Team = async () => {
  const members = await getPublishedTeamMembers();

  if (members.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16 md:py-20 overflow-hidden">
      {/* Title and cards animate in sequence */}
      <StaggerContainer className="section-container">
        <StaggerItem>
          <h2 className="font-clash-display text-blue text-2xl md:text-3xl lg:text-4xl font-bold">
            Meet Our Team
          </h2>
        </StaggerItem>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {members.map((member) => (
            <StaggerItem key={member.id}>
              <TeamCard
                name={member.name}
                role={member.role}
                image={member.image}
                linkedinUrl={member.linkedinUrl}
                email={member.email}
              />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
};

export default Team;
