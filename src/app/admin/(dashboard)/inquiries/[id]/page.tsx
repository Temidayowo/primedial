import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { getInquiryByIdAdmin } from "@/lib/actions/admin/inquiries.action";
import { INQUIRY_TYPE_LABELS } from "@/lib/inquiries";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Inquiry",
};

export default async function AdminInquiryPage({ params }: PageProps<"/admin/inquiries/[id]">) {
  const { id } = await params;
  const inquiry = await getInquiryByIdAdmin(id);
  if (!inquiry) notFound();

  const details = [
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Company", inquiry.company],
    ["Subject", inquiry.subject],
    [inquiry.type === "SERVICE_REQUEST" ? "Equipment" : "Service", inquiry.service],
    ["Model", inquiry.model],
    ["Location", inquiry.location],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  const replySubject = encodeURIComponent(
    `Re: ${inquiry.subject ?? INQUIRY_TYPE_LABELS[inquiry.type]}`,
  );

  return (
    <ContentFormPage
      title={INQUIRY_TYPE_LABELS[inquiry.type]}
      backHref="/admin/inquiries"
      backLabel="All inquiries"
    >
      <div className="max-w-2xl space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5">
          <div>
            <p className="font-clash-display text-lg font-bold text-blue">{inquiry.name}</p>
            <p className="text-xs text-slate-400">
              Received{" "}
              {inquiry.createdAt.toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <InquiryStatusSelect id={inquiry.id} status={inquiry.status} />
        </div>

        <dl className="grid gap-x-6 gap-y-3 rounded-xl border border-gray-100 bg-white p-5 text-sm sm:grid-cols-[8rem_1fr]">
          {details.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-slate-400">{label}</dt>
              <dd className="break-words text-blue">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h2 className="text-xs font-medium tracking-wide text-slate-500 uppercase">Message</h2>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
            {inquiry.message}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${inquiry.email}?subject=${replySubject}`}
            className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            <Mail className="size-4" /> Reply by email
          </a>
          {inquiry.phone && (
            <a
              href={`tel:${inquiry.phone.replace(/[^\d+]/g, "")}`}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-blue transition-colors hover:bg-gray-50"
            >
              <Phone className="size-4" /> Call
            </a>
          )}
        </div>
      </div>
    </ContentFormPage>
  );
}
