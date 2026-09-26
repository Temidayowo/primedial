"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import {
  type ContentFormState,
  displayOrder,
  fieldErrors,
  imageField,
  isChecked,
  isUuid,
  optionalField,
  requiredText,
  revalidateContent,
  sortOrderField,
  urlField,
} from "./content-shared";

const ADMIN_PATH = "/admin/partners";
const PUBLIC_PATHS = ["/"];

const partnerSchema = z.object({
  name: requiredText("Name"),
  logo: imageField("Logo"),
  websiteUrl: optionalField(urlField),
  isPublished: z.boolean(),
  sortOrder: sortOrderField,
});

function parse(formData: FormData) {
  return partnerSchema.safeParse({
    name: formData.get("name"),
    logo: formData.get("logo"),
    websiteUrl: formData.get("websiteUrl"),
    isPublished: isChecked(formData, "isPublished"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });
}

export async function getPartnersAdmin() {
  await requireAdmin();
  return prisma.partner.findMany({ orderBy: displayOrder });
}

export async function getPartnerByIdAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;
  return prisma.partner.findUnique({ where: { id } });
}

export async function createPartner(
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  await prisma.partner.create({ data: validated.data });

  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  redirect(ADMIN_PATH);
}

export async function updatePartner(
  id: string,
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  await prisma.partner.update({ where: { id }, data: validated.data });

  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  redirect(ADMIN_PATH);
}

export async function deletePartner(id: string) {
  await requireAdmin();
  await prisma.partner.deleteMany({ where: { id } });
  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  return { error: null };
}
