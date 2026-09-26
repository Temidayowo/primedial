"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { SocialPlatform } from "@/generated/prisma/enums";
import { SOCIAL_PLATFORM_LABELS } from "@/lib/social-platforms";
import {
  type ContentFormState,
  displayOrder,
  fieldErrors,
  isChecked,
  isUuid,
  sortOrderField,
  urlField,
} from "./content-shared";

const ADMIN_PATH = "/admin/socials";

const socialLinkSchema = z.object({
  platform: z.enum(SocialPlatform, { error: "Pick a platform." }),
  url: urlField,
  isPublished: z.boolean(),
  sortOrder: sortOrderField,
});

function parse(formData: FormData) {
  return socialLinkSchema.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
    isPublished: isChecked(formData, "isPublished"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });
}

// The icons live in the footer, which every public page renders - so a
// change here has to invalidate everything under "/".
function revalidateSocials() {
  revalidatePath(ADMIN_PATH);
  revalidatePath("/", "layout");
}

// Platform is unique (one link per platform). Checked up front so the
// admin gets a readable error instead of a unique-constraint crash.
async function platformTakenError(
  platform: SocialPlatform,
  exceptId?: string,
): Promise<ContentFormState> {
  const existing = await prisma.socialLink.findUnique({ where: { platform } });
  if (!existing || existing.id === exceptId) return undefined;
  return {
    errors: {
      platform: [
        `There is already a ${SOCIAL_PLATFORM_LABELS[platform]} link. Edit that one instead.`,
      ],
    },
  };
}

export async function getSocialLinksAdmin() {
  await requireAdmin();
  return prisma.socialLink.findMany({ orderBy: displayOrder });
}

export async function getSocialLinkByIdAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;
  return prisma.socialLink.findUnique({ where: { id } });
}

export async function createSocialLink(
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  const taken = await platformTakenError(validated.data.platform);
  if (taken) return taken;

  await prisma.socialLink.create({ data: validated.data });

  revalidateSocials();
  redirect(ADMIN_PATH);
}

export async function updateSocialLink(
  id: string,
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  const taken = await platformTakenError(validated.data.platform, id);
  if (taken) return taken;

  await prisma.socialLink.update({ where: { id }, data: validated.data });

  revalidateSocials();
  redirect(ADMIN_PATH);
}

export async function deleteSocialLink(id: string) {
  await requireAdmin();
  await prisma.socialLink.deleteMany({ where: { id } });
  revalidateSocials();
  return { error: null };
}
