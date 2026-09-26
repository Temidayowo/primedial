"use server";

import * as z from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { EMAIL_FROM, getResendClient, isEmailConfigured } from "@/lib/resend";
import { normalizeEmail } from "@/lib/email-address";
import { InquiryType } from "@/generated/prisma/enums";
import { INQUIRY_TYPE_LABELS } from "@/lib/inquiries";

export type InquiryFormState =
  | { ok: true; message: string }
  | { ok: false; errors?: Record<string, string[] | undefined>; message?: string }
  | undefined;

const text = (label: string, max = 200) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, { error: `${label} is required.` })
    .max(max, { error: `${label} is too long.` });

const optionalText = (max = 200) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : undefined),
    z.string().max(max, { error: "This is too long." }).optional(),
  );

const baseSchema = z.object({
  name: text("Your name", 120),
  email: z.email({ error: "Enter a valid email address." }).transform(normalizeEmail),
  phone: optionalText(40),
  company: optionalText(160),
  message: text("A message", 5000),
});

// Each form collects a slightly different set of fields.
const schemas = {
  [InquiryType.CONTACT]: baseSchema.extend({ subject: text("A subject", 160) }),
  [InquiryType.CONSULTATION]: baseSchema.extend({
    service: text("The service needed", 160),
    location: optionalText(160),
  }),
  [InquiryType.SERVICE_REQUEST]: baseSchema.extend({
    service: text("The equipment type", 160),
    model: optionalText(160),
  }),
};

// Handles the contact, consultation and service-request forms. Bound to
// the form's type on the client: submitInquiry.bind(null, "CONTACT").
export async function submitInquiry(
  type: InquiryType,
  _prevState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const schema = schemas[type];
  if (!schema) return { ok: false, message: "Something went wrong. Please try again." };

  // Hidden field real visitors never see or fill in - bots usually do.
  // Pretend it worked so the bot doesn't retry.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { ok: true, message: "Thanks - we've received your message." };
  }

  const validated = schema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return {
      ok: false,
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors as Record<
        string,
        string[] | undefined
      >,
    };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const allowed = await checkRateLimit(`inquiry:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return {
      ok: false,
      message: "You've sent several messages recently. Please wait a while and try again.",
    };
  }

  const data = validated.data as z.infer<typeof baseSchema> & {
    subject?: string;
    service?: string;
    model?: string;
    location?: string;
  };

  const inquiry = await prisma.inquiry.create({
    data: {
      type,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      subject: data.subject ?? null,
      service: data.service ?? null,
      model: data.model ?? null,
      location: data.location ?? null,
      message: data.message,
    },
  });

  revalidatePath("/admin/inquiries");

  // Saved first, so a failed email never loses the inquiry.
  try {
    await notifyTeam(inquiry.id);
  } catch (error) {
    console.error(`[inquiry] Notification email failed for ${inquiry.id}:`, error);
  }

  return {
    ok: true,
    message:
      type === InquiryType.CONTACT
        ? "Thanks - we've received your message and will reply within one business day."
        : "Thanks - your request is in. Our team will contact you within one business day.",
  };
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Emails the team when INQUIRY_NOTIFY_EMAIL is set. Every field is
// visitor-supplied, so it's all escaped.
async function notifyTeam(inquiryId: string) {
  const to = process.env.INQUIRY_NOTIFY_EMAIL;
  if (!to || !isEmailConfigured()) return;

  const inquiry = await prisma.inquiry.findUniqueOrThrow({ where: { id: inquiryId } });
  const rows = (
    [
      ["Name", inquiry.name],
      ["Email", inquiry.email],
      ["Phone", inquiry.phone],
      ["Company", inquiry.company],
      ["Subject", inquiry.subject],
      ["Service / equipment", inquiry.service],
      ["Model", inquiry.model],
      ["Location", inquiry.location],
    ] as const
  )
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px;">${label}</td><td style="padding:4px 0;color:#0f172a;font-size:13px;">${escapeHtml(value!)}</td></tr>`,
    )
    .join("");

  const { error } = await getResendClient().emails.send({
    from: EMAIL_FROM,
    to,
    replyTo: inquiry.email,
    subject: `New ${INQUIRY_TYPE_LABELS[inquiry.type].toLowerCase()} from ${inquiry.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px;">
        <h1 style="color:#0f172a;font-size:18px;">New ${INQUIRY_TYPE_LABELS[inquiry.type].toLowerCase()}</h1>
        <table style="border-collapse:collapse;margin:12px 0;">${rows}</table>
        <p style="white-space:pre-wrap;color:#334155;font-size:14px;line-height:1.6;border-top:1px solid #e2e8f0;padding-top:12px;">${escapeHtml(inquiry.message)}</p>
        <p style="color:#94a3b8;font-size:12px;">Reply to this email to answer ${escapeHtml(inquiry.name)} directly. Track it under Inquiries in the admin.</p>
      </div>
    `,
  });

  if (error) throw error;
}
