import type { SocialPlatform } from "@/generated/prisma/enums";

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  FACEBOOK: "Facebook",
  X: "X (Twitter)",
  INSTAGRAM: "Instagram",
  LINKEDIN: "LinkedIn",
  YOUTUBE: "YouTube",
  TIKTOK: "TikTok",
  WHATSAPP: "WhatsApp",
};
