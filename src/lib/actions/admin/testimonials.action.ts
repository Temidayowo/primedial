"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import {
  type ContentFormState,
  displayOrder,
  fieldErrors,
  isChecked,
  isUuid,
  requiredText,
  revalidateContent,
  sortOrderField,
} from "./content-shared";

const ADMIN_PATH = "/admin/testimonials";
const PUBLIC_PATHS = ["/"];

const testimonialSchema = z.object({
  name: requiredText("Name"),
  role: requiredText("Role / company"),
  content: requiredText("Testimonial", 10),
  rating: z.coerce
    .number({ error: "Pick a rating." })
    .int()
    .min(1, { error: "Rating must be between 1 and 5." })
    .max(5, { error: "Rating must be between 1 and 5." }),
  isPublished: z.boolean(),
  sortOrder: sortOrderField,
});

function parse(formData: FormData) {
  return testimonialSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    content: formData.get("content"),
    rating: formData.get("rating"),
    isPublished: isChecked(formData, "isPublished"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });
}

export async function getTestimonialsAdmin() {
  await requireAdmin();
  return prisma.testimonial.findMany({ orderBy: displayOrder });
}

export async function getTestimonialByIdAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;
  return prisma.testimonial.findUnique({ where: { id } });
}

export async function createTestimonial(
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  await prisma.testimonial.create({ data: validated.data });

  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  redirect(ADMIN_PATH);
}

export async function updateTestimonial(
  id: string,
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();

  const validated = parse(formData);
  if (!validated.success) return { errors: fieldErrors(validated.error) };

  await prisma.testimonial.update({ where: { id }, data: validated.data });

  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  redirect(ADMIN_PATH);
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.deleteMany({ where: { id } });
  revalidateContent(ADMIN_PATH, PUBLIC_PATHS);
  return { error: null };
}
