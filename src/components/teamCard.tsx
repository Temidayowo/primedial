import Image from "next/image";
import { FaLinkedin, FaEnvelope } from "react-icons/fa6";

const TeamCard = () => {
  return (
    <div className="bg-gray-100 rounded-xl overflow-hidden group hover:shadow-lg transition-shadow duration-300   ease-in-out">
      <div className="relative w-full h-60 overflow-hidden">
        <Image
          src="/images/grp-of-survs.png"
          alt="Team Member"
          width={1024}
          height={1024}
          className="w-full h-80 lg:h-60 object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>
      <div className="flex flex-col py-6 px-4">
        <h3 className="font-clash-display text-lg font-bold text-blue">
          John Doe
        </h3>
        <p className="text-gray-700 font-poppins text-sm">Position</p>
        <div className="flex gap-4 mt-4">
          <a href="#" className="text-gray-700 hover:text-blue transition-colors duration-300 text-lg">
            <FaLinkedin />
          </a>
          <a href="mailto:john.doe@example.com" className="text-gray-700 hover:text-blue transition-colors duration-300 text-lg">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
