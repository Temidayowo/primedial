import type { Metadata } from "next";
import { requireAdmin } from "@/lib/dal";
import { contactMapEmbedUrl, getContactDetails } from "@/lib/site-settings";
import { ContactDetailsForm } from "@/components/admin/contact-details-form";

export const metadata: Metadata = {
  title: "Contact Details",
};

export default async function AdminSettingsPage() {
  await requireAdmin();
  const details = await getContactDetails();

  return (
    <div>
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Contact Details
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Shown on the Contact page, in the site footer and in order emails.
      </p>

      <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,42rem)_1fr]">
        <ContactDetailsForm details={details} />

        <div>
          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
            Current map
          </p>
          <iframe
            title="Map preview"
            src={contactMapEmbedUrl(details)}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="mt-1.5 h-64 w-full rounded-xl border border-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
