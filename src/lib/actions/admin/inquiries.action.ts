"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { InquiryStatus } from "@/generated/prisma/enums";
import { isUuid } from "@/lib/uuid";

export async function getInquiriesAdmin(status?: InquiryStatus) {
  await requireAdmin();
  return prisma.inquiry.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getInquiryCountsAdmin() {
  await requireAdmin();
  const groups = await prisma.inquiry.groupBy({ by: ["status"], _count: true });
  const counts: Record<InquiryStatus, number> = { NEW: 0, IN_PROGRESS: 0, RESOLVED: 0 };
  for (const group of groups) counts[group.status] = group._count;
  return counts;
}

export async function getInquiryByIdAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;
  return prisma.inquiry.findUnique({ where: { id } });
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await requireAdmin();
  if (!isUuid(id) || !Object.values(InquiryStatus).includes(status)) {
    return { error: "Invalid request." };
  }

  await prisma.inquiry.updateMany({ where: { id }, data: { status } });

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  return { error: null };
}
