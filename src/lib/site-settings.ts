import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface ContactDetails {
  address: string;
  phones: string[];
  email: string;
  businessHours: string;
  mapEmbedUrl: string | null;
}

// Used if the settings row is ever missing, so the contact page and
// footer never break. The real values live in the database and are
// edited at /admin/settings.
const FALLBACK: ContactDetails = {
  address: "12, Akin Osiyemi Street, Allen Ikeja, Lagos State, Nigeria",
  phones: ["+234 808 472 9494", "+234 706 835 4374"],
  email: "info@primedialsolutions.com",
  businessHours: "Mon-Fri, 8:00am-6:00pm",
  mapEmbedUrl: null,
};

export const SITE_SETTINGS_ID = "default";

// Cached per request - the footer and the contact page both read it.
export const getContactDetails = cache(async (): Promise<ContactDetails> => {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: SITE_SETTINGS_ID } });
    if (!row) return FALLBACK;
    return {
      address: row.address,
      phones: row.phones,
      email: row.email,
      businessHours: row.businessHours,
      mapEmbedUrl: row.mapEmbedUrl,
    };
  } catch (error) {
    console.error("[site settings] Falling back to defaults:", error);
    return FALLBACK;
  }
});

// The map on the contact page: the admin's embed URL if set, otherwise a
// map generated from the address.
export function contactMapEmbedUrl(details: ContactDetails) {
  return (
    details.mapEmbedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(details.address)}&output=embed`
  );
}

// "+234 808 472 9494" -> "tel:+2348084729494"
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
