"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { SITE_SETTINGS_ID } from "@/lib/site-settings";

export type ContactDetailsFormState =
  | { ok: true; message: string }
  | { ok: false; message?: string; errors?: Record<string, string[] | undefined> }
  | undefined;

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

const schema = z.object({
  address: z.string().trim().min(5, { error: "Enter the business address." }).max(300),
  phones: z
    .array(
      z
        .string()
        .trim()
        .regex(PHONE_PATTERN, { error: "Enter phone numbers like +234 808 472 9494." }),
    )
    .min(1, { error: "Add at least one phone number." })
    .max(4, { error: "Up to 4 phone numbers." }),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  businessHours: z.string().trim().min(3, { error: "Enter your business hours." }).max(120),
  mapEmbedUrl: z.preprocess(
    (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : null),
    z
      .url({ error: "Paste the map link from Google Maps." })
      .refine((url) => /^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(url), {
        error: "Use a Google Maps embed link (Share > Embed a map > copy the src).",
      })
      .nullable(),
  ),
});

export async function updateContactDetails(
  _prevState: ContactDetailsFormState,
  formData: FormData,
): Promise<ContactDetailsFormState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    address: formData.get("address"),
    phones: formData
      .getAll("phones")
      .map(String)
      .filter((phone) => phone.trim() !== ""),
    email: formData.get("email"),
    businessHours: formData.get("businessHours"),
    mapEmbedUrl: formData.get("mapEmbedUrl"),
  });
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: parsed.data,
    create: { id: SITE_SETTINGS_ID, ...parsed.data },
  });

  // The footer shows these on every public page, the contact page shows
  // them all - refresh everything under the root layout.
  revalidatePath("/", "layout");
  return { ok: true, message: "Contact details saved. The website is updated." };
}
