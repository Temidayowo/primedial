import type { IconType } from "react-icons";

interface WhatWeOffer {
  header: string;
  text: string;
  icon: IconType;
  accent?: "blue" | "gray";
}

const WhatWeOfferCard = ({ header, text, icon, accent = "blue" }: WhatWeOffer) => {
  const Icon = icon;
  const isGray = accent === "gray";

  return (
    <div className="group w-full rounded-xl border-[0.1px] border-gray-300 bg-gray-50 px-4 py-6 transition-all duration-300 ease-out hover:-translate-y-2  hover:shadow-xl">
      <div
        className={`flex size-14 items-center justify-center rounded-xl bg-gray-100 p-4 transition-all duration-300 ease-out group-hover:rotate-3 ${
          isGray ? "group-hover:bg-gray-700" : "group-hover:bg-blue"
        }`}
      >
        {Icon && (
          <Icon
            className={`size-6 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:text-white ${
              isGray ? "text-gray-500" : "text-blue"
            }`}
          />
        )}
      </div>

      <h3 className="mt-5 text-lg font-semibold font-clash-display text-blue">
        {header}
      </h3>
      <p className="mt-2 font-poppins text-sm text-gray-700">{text}</p>
    </div>
  );
};

export default WhatWeOfferCard;
