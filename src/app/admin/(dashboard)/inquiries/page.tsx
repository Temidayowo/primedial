import type { Metadata } from "next";
import Link from "next/link";
import {
  getInquiriesAdmin,
  getInquiryCountsAdmin,
} from "@/lib/actions/admin/inquiries.action";
import { InquiryStatus } from "@/generated/prisma/enums";
import { INQUIRY_STATUS_LABELS, INQUIRY_TYPE_LABELS } from "@/lib/inquiries";
import { ContentEmptyState, ContentTable } from "@/components/admin/content/list-ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Inquiries",
};

const statusStyles: Record<InquiryStatus, string> = {
  NEW: "bg-blue/10 text-blue",
  IN_PROGRESS: "bg-orange-50 text-orange-600",
  RESOLVED: "bg-green/10 text-green",
};

export default async function AdminInquiriesPage({
  searchParams,
}: PageProps<"/admin/inquiries">) {
  const { status: statusParam } = await searchParams;
  const status = Object.values(InquiryStatus).find((s) => s === statusParam);

  const [inquiries, counts] = await Promise.all([
    getInquiriesAdmin(status),
    getInquiryCountsAdmin(),
  ]);

  const tabs = [
    { label: "All", href: "/admin/inquiries", active: !status },
    ...Object.values(InquiryStatus).map((s) => ({
      label: `${INQUIRY_STATUS_LABELS[s]} (${counts[s]})`,
      href: `/admin/inquiries?status=${s}`,
      active: status === s,
    })),
  ];

  return (
    <div>
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Inquiries
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Messages from the contact, consultation and service request forms.
      </p>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Filter by status">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-300",
              tab.active
                ? "border-blue bg-blue text-white"
                : "border-gray-200 bg-white text-slate-500 hover:text-blue",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {inquiries.length === 0 ? (
        <ContentEmptyState message="No inquiries here yet." />
      ) : (
        <ContentTable headers={["From", "Type", "About", "Received", "Status"]}>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="border-b border-gray-50 align-top last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="font-medium text-blue hover:underline"
                >
                  {inquiry.name}
                </Link>
                <p className="text-xs text-slate-400">{inquiry.email}</p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                {INQUIRY_TYPE_LABELS[inquiry.type]}
              </td>
              <td className="max-w-xs px-4 py-3 text-slate-500">
                <p className="font-medium text-slate-600">
                  {inquiry.subject ?? inquiry.service ?? "-"}
                </p>
                <p className="line-clamp-1 text-xs">{inquiry.message}</p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                {inquiry.createdAt.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
                    statusStyles[inquiry.status],
                  )}
                >
                  {INQUIRY_STATUS_LABELS[inquiry.status]}
                </span>
              </td>
            </tr>
          ))}
        </ContentTable>
      )}
    </div>
  );
}
