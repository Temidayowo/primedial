import type { IconType } from "react-icons";

interface IconCardProps {
  name: string;
  icon?: IconType;
}

const IconCard = ({ name, icon }: IconCardProps) => {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center justify-center mt-4 text-center">
      <div className="mb-3 flex size-14 items-center justify-center rounded-xl bg-gray-200 p-4 transition-all duration-300 ease-out group-hover:rotate-3 group hover:bg-blue">
        {Icon && (
          <Icon className="size-6 text-blue transition-transform duration-300 ease-out group-hover:scale-110 group-hover:text-white" />
        )}
      </div>
      <p className="text-blue text-[11px] font-semibold uppercase sm:text-[12px] md:text-[13px]">
        {name}
      </p>
    </div>
  );
};

export default IconCard;
