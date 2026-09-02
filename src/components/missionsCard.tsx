// Adjust the import path to match the location of your animation wrapper file
import { AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";

const MissionsCard = ({
  title, 
  description, 
  iconElement
}: {
  title: string, 
  description: string, 
  iconElement: React.ReactNode
}) => {
    return ( 
        <AnimateOnScroll 
            variants={fadeUp} 
            duration={0.6}
            // Added 'h-full flex flex-col' so all cards match height in the grid
            className="bg-gray-50 py-8 px-6 rounded-lg h-full flex flex-col"
        >
            <div className="text-white text-2xl mb-4 p-4 bg-blue inline-block rounded-lg self-start">
                {iconElement}
            </div>
            <h3 className="font-clash-display text-lg font-bold text-blue mb-2">
                {title}
            </h3>
            <p className="text-gray-700 font-poppins text-sm">
                {description}
            </p>
        </AnimateOnScroll>
     );
}
 
export default MissionsCard;