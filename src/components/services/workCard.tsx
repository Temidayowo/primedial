import Image from "next/image";
import { FaLocationDot } from "react-icons/fa6";

interface WorkCardProps {
  image: string;
  name?: string;
  location?: string;
  about?: string;
  year?: Date | string;
}

const WorkCard = ({ name, image, location, about, year }: WorkCardProps) => {
  const formattedDate = year ? new Date(year).toLocaleDateString() : "New";

  return (
    <div className="rounded-xl group hover:shadow-xl shadow-gray-400 relative overflow-hidden bg-gray-100 border-[0.1px] border-gray-200">
      <Image
        src={image}
        alt={name || "Work card"}
        width={600}
        height={400}
        className="group-hover:scale-105 object-cover transition duration-300"
        priority
      />
      <span className="absolute top-3 left-3 z-20 bg-green rounded-full px-4 py-1 text-xs text-white">
        {formattedDate}
      </span>
      <div className="relative z-20 flex flex-col bg-gray-100 px-3 py-2">
        <h3 className="text-blue font-semibold text-lg">{name}</h3>
        <p className="text-gray-500 text-[13px] mt-1">{about}</p>
        <div className="flex gap-2 items-center mt-3">
          <FaLocationDot className="text-green text-xs" />
          <p className="uppercase text-gray-700 text-xs font-medium">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
