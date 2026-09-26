import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartnerByIdAdmin, updatePartner } from "@/lib/actions/admin/partners.action";
import { PartnerForm } from "@/components/admin/content/partner-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Edit Partner",
};

export default async function EditPartnerPage({ params }: PageProps<"/admin/partners/[id]">) {
  const { id } = await params;
  const partner = await getPartnerByIdAdmin(id);
  if (!partner) notFound();

  return (
    <ContentFormPage title="Edit Partner" backHref="/admin/partners" backLabel="All partners">
      <PartnerForm
        action={updatePartner.bind(null, id)}
        partner={partner}
        submitLabel="Save Changes"
      />
    </ContentFormPage>
  );
}
