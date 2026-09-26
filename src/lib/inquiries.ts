import type { InquiryStatus, InquiryType } from "@/generated/prisma/enums";

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  CONTACT: "Contact message",
  CONSULTATION: "Consultation request",
  SERVICE_REQUEST: "Service request",
};

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

// Subjects offered on the contact form. /contact?subject=quote&product=<name>
// preselects "Request a Quote" and names the product in the message.
export const CONTACT_SUBJECTS = [
  { value: "general", label: "General enquiry" },
  { value: "quote", label: "Request a Quote" },
  { value: "order", label: "Order or delivery" },
  { value: "support", label: "Repair, calibration or support" },
  { value: "training", label: "Training" },
  { value: "other", label: "Other" },
] as const;
