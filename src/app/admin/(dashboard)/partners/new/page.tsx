import type { Metadata } from "next";
import { createPartner } from "@/lib/actions/admin/partners.action";
import { PartnerForm } from "@/components/admin/content/partner-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Add Partner",
};

export default function NewPartnerPage() {
  return (
    <ContentFormPage title="Add Partner" backHref="/admin/partners" backLabel="All partners">
      <PartnerForm action={createPartner} submitLabel="Add Partner" />
    </ContentFormPage>
  );
}
