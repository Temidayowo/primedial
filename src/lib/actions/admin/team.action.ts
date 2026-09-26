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

const ADMIN_PATH = "/admin/team";
const PUBLIC_PATHS = ["/about"];

const teamMemberSchema = z.object({
  name: requiredText("Name"),
  role: requiredText("Role"),
  image: optionalField(imageField("Photo")),
  linkedinUrl: optionalField(urlField),
  email: optionalField(z.email({ error: "Enter a valid email address." })),
  isPublished: z.boolean(),
  sortOrder: sortOrderField,
});

function parse(formData: FormData) {
  return teamMemberSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    image: formData.get("image"),
    linkedinUrl: formData.get("linkedinUrl"),
    email: formData.get("email"),
    isPublished: isChecked(formData, "isPublished"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });
}

export async function getTeamMembersAdmin() {
  await requireAdmin();
  return prisma.teamMember.findMany({ orderBy: displayOrder });
}

export async function getTeamMemberByIdAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function createTeamMember(
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  await prisma.teamMember.create({ data: validated.data });

  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  redirect(ADMIN_PATH);
}

export async function updateTeamMember(
  id: string,
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  await prisma.teamMember.update({ where: { id }, data: validated.data });

  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  redirect(ADMIN_PATH);
}

export async function deleteTeamMember(id: string) {
  await requireAdmin();
  await prisma.teamMember.deleteMany({ where: { id } });
  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  return { error: null };
}
