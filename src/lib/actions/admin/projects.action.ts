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
} from "./content-shared";

const ADMIN_PATH = "/admin/projects";
const PUBLIC_PATHS = ["/services"];

const projectSchema = z.object({
  title: requiredText("Title"),
  summary: requiredText("Summary", 5),
  location: requiredText("Location"),
  image: imageField(),
  year: optionalField(
    z.coerce
      .number({ error: "Year must be a number." })
      .int({ error: "Enter a full year, e.g. 2024." })
      .min(1950, { error: "Enter a year from 1950 onwards." })
      .max(2100, { error: "Enter a realistic year." }),
  ),
  isExample: z.boolean(),
  isPublished: z.boolean(),
  sortOrder: sortOrderField,
});

function parse(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    location: formData.get("location"),
    image: formData.get("image"),
    year: formData.get("year"),
    isExample: isChecked(formData, "isExample"),
    isPublished: isChecked(formData, "isPublished"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });
}

export async function getProjectsAdmin() {
  await requireAdmin();
  return prisma.project.findMany({ orderBy: displayOrder });
}

export async function getProjectByIdAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;
  return prisma.project.findUnique({ where: { id } });
}

export async function createProject(
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  await prisma.project.create({ data: validated.data });

  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  redirect(ADMIN_PATH);
}

export async function updateProject(
  id: string,
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  await prisma.project.update({ where: { id }, data: validated.data });

  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  redirect(ADMIN_PATH);
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.deleteMany({ where: { id } });
  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  return { error: null };
}
