"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryStatus } from "@/lib/actions/admin/inquiries.action";
import { InquiryStatus } from "@/generated/prisma/enums";
import { INQUIRY_STATUS_LABELS } from "@/lib/inquiries";

export function InquiryStatusSelect({ id, status }: { id: string; status: InquiryStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const change = (next: InquiryStatus) => {
    const previous = value;
    setValue(next);
    setError(null);
    startTransition(async () => {
      try {
        const result = await updateInquiryStatus(id, next);
        if (result.error) throw new Error(result.error);
        router.refresh();
      } catch {
        setValue(previous);
        setError("Couldn't update the status. Try again.");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        aria-label="Inquiry status"
        value={value}
        disabled={isPending}
        onChange={(e) => change(e.target.value as InquiryStatus)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-blue focus:border-blue-500 focus:outline-none disabled:opacity-60"
      >
        {Object.values(InquiryStatus).map((option) => (
          <option key={option} value={option}>
            {INQUIRY_STATUS_LABELS[option]}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
