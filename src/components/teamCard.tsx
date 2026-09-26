import Image from "next/image";
import { FaLinkedin, FaEnvelope } from "react-icons/fa6";
import { imageProps } from "@/lib/images";

interface TeamCardProps {
  name: string;
  role: string;
  image?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

const TeamCard = ({ name, role, image, linkedinUrl, email }: TeamCardProps) => {
  return (
    <div className="bg-gray-100 rounded-xl overflow-hidden group hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="relative w-full h-60 overflow-hidden bg-blue">
        {image ? (
          <Image
            {...imageProps(image)}
            alt={name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full items-center justify-center font-clash-display text-5xl font-bold text-white/90"
          >
            {initials(name)}
          </div>
        )}
      </div>
      <div className="flex flex-col py-6 px-4">
        <h3 className="font-clash-display text-lg font-bold text-blue">{name}</h3>
        <p className="text-gray-700 font-poppins text-sm">{role}</p>
        {(linkedinUrl || email) && (
          <div className="flex gap-4 mt-4">
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on LinkedIn`}
                className="text-gray-700 hover:text-blue transition-colors duration-300 text-lg"
              >
                <FaLinkedin />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                aria-label={`Email ${name}`}
                className="text-gray-700 hover:text-blue transition-colors duration-300 text-lg"
              >
                <FaEnvelope />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
