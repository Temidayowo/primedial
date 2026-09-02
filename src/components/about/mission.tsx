import { FaRocket } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { TbTarget } from "react-icons/tb";
import MissionsCard from "../missionsCard";
// Adjust this import path to match your animation wrapper file
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const Missions = () => {
  return (
    <section className=" overflow-hidden">
      {/* 
        Replaced the standard div with StaggerContainer.
        This ensures the 3 cards animate in one after the other. 
      */}
      <StaggerContainer className="section-container grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        <StaggerItem>
          <MissionsCard 
            title="Our Mission" 
            description="To provide outstanding value in service delivery through collaboration, innovation, and creativity." 
            iconElement={<TbTarget />} 
          />
        </StaggerItem>

        <StaggerItem>
          <MissionsCard 
            title="Our Vision" 
            description="To be a globally recognized provider of geospatial solutions cutting across Environment, Land Administration, Infrastructure, Security, and Energy sectors." 
            iconElement={<IoEyeSharp />} 
          />
        </StaggerItem>

        <StaggerItem>
          <MissionsCard 
            title="Core Values" 
            description="Our cores values are Integrity, Excellence and Professionalism Corporate Culture: We have a corporate culture that integrates our core values in providing optimal services delivery to our clients. The dedication, great working relationship, and commitment of our people are what drive the outcome of our excellent services." 
            iconElement={<FaRocket />} 
          />
        </StaggerItem>

      </StaggerContainer>
    </section>
  );
};

export default Missions;