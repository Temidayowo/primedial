import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { SocialPlatform } from "@/generated/prisma/enums";

const SOCIAL_ICONS: Record<SocialPlatform, IconType> = {
  FACEBOOK: FaFacebook,
  X: FaXTwitter,
  INSTAGRAM: FaInstagram,
  LINKEDIN: FaLinkedin,
  YOUTUBE: FaYoutube,
  TIKTOK: FaTiktok,
  WHATSAPP: FaWhatsapp,
};

export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const Icon = SOCIAL_ICONS[platform];
  return <Icon className={className} aria-hidden="true" />;
}
