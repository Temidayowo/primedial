import Image from "next/image";
import { FaLocationDot } from "react-icons/fa6";
import { imageProps } from "@/lib/images";

interface WorkCardProps {
  image: string;
  name?: string;
  location?: string;
  about?: string;
  year?: number | null;
  isExample?: boolean;
}

const WorkCard = ({
  name,
  image,
  location,
  about,
  year,
  isExample,
}: WorkCardProps) => {
  return (
    <div className="rounded-xl group hover:shadow-xl shadow-gray-400 relative overflow-hidden bg-gray-100 border-[0.1px] border-gray-300">
      {/* Fixed 3:2 frame so admin-uploaded photos of any shape line up. */}
      <Image
        {...imageProps(image)}
        alt={name || "Work card"}
        width={600}
        height={400}
        className="aspect-3/2 w-full group-hover:scale-105 object-cover transition duration-300"
        priority
      />
      <span className="absolute top-3 left-3 z-20 bg-green rounded-full px-4 py-1 text-xs text-white">
        {year ?? "New"}
      </span>
      {isExample && (
        <span className="absolute top-3 right-3 z-20 bg-amber-600 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          Example
        </span>
      )}
      <div className="relative z-20 flex flex-col bg-gray-100 px-3 py-4">
        <h3 className="text-blue font-semibold text-lg font-clash-display">{name}</h3>
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
