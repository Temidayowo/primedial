import type { Metadata } from "next";
import Header from "@/components/header";
import EquipmentSupportContent from "./equipmentSupportContent";

export const metadata: Metadata = {
  title: "Equipment Repair & Calibration | Primedial",
  description:
    "Request expert repair and calibration for GNSS receivers, total stations, 3D scanners, and other survey instruments.",
};

const EquipmentSupportPage = () => (
  <>
    <Header
      theme="dark"
      className="bg-transparent absolute"
      mobileClassName="absolute top-0 left-0 z-50 w-full bg-transparent border-b-0"
    />
    <EquipmentSupportContent />
  </>
);

export default EquipmentSupportPage;
