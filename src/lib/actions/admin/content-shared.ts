import "server-only";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { isValidImageSrc } from "@/lib/images";

// Shared pieces for the CMS server actions (projects, team, testimonials,
// partners, social links). Not a "use server" module itself - those can
// only export async functions.

export type ContentFormState =
  | { errors?: Record<string, string[] | undefined>; message?: string }
  | undefined;

export const displayOrder = [
  { sortOrder: "asc" as const },
  { createdAt: "asc" as const },
];

const blankToUndefined = (value: unknown) =>
  value === null || (typeof value === "string" && value.trim() === "")
    ? undefined
    : value;

// An optional form field that saves as null when left blank. Null (not
// undefined) matters on update: Prisma skips undefined fields, so
// clearing an input would otherwise leave the old value in place.
export function optionalField<T extends z.ZodType>(schema: T) {
  return z
    .preprocess(blankToUndefined, schema.optional())
    .transform((value) => value ?? null);
}

export function requiredText(label: string, min = 2) {
  return z
    .string({ error: `${label} is required.` })
    .trim()
    .min(min, { error: `${label} is required.` });
}

export function imageField(label = "Image") {
  return requiredText(label, 1).refine(isValidImageSrc, {
    error: "Use a path starting with / (e.g. /images/example.jpg) or a full https:// URL.",
  });
}

export const urlField = z.url({
  protocol: /^https?$/,
  error: "Enter a full link starting with https://",
});

export const sortOrderField = z.coerce
  .number({ error: "Display order must be a number." })
  .int({ error: "Display order must be a whole number." })
  .min(0, { error: "Display order can't be negative." })
  .max(9999, { error: "Display order must be 9999 or less." });

export function isChecked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export function fieldErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
}

// Ids come straight from the URL; a malformed one would make Postgres
// reject the uuid cast and crash the page instead of showing a 404.
export function isUuid(id: string) {
  return z.uuid().safeParse(id).success;
}

// Public pages are prerendered, so every CMS write has to invalidate
// the page(s) that render that content, plus its admin list.
export function revalidateContent(adminPath: string, publicPaths: string[]) {
  revalidatePath(adminPath);
  for (const path of publicPaths) revalidatePath(path);
}
