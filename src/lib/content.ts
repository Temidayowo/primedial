import "server-only";
import { prisma } from "@/lib/prisma";

// Public-site reads for the CMS sections managed under /admin. Only
// published entries, in the admin-chosen order (ties: oldest first).

const displayOrder = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];

export function getPublishedProjects() {
  return prisma.project.findMany({ where: { isPublished: true }, orderBy: displayOrder });
}

export function getPublishedTeamMembers() {
  return prisma.teamMember.findMany({ where: { isPublished: true }, orderBy: displayOrder });
}

export function getPublishedTestimonials() {
  return prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: displayOrder });
}

export function getPublishedPartners() {
  return prisma.partner.findMany({ where: { isPublished: true }, orderBy: displayOrder });
}

export function getPublishedSocialLinks() {
  return prisma.socialLink.findMany({ where: { isPublished: true }, orderBy: displayOrder });
}
