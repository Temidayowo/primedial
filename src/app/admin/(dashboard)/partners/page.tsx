import type { Metadata } from "next";
import Image from "next/image";
import { deletePartner, getPartnersAdmin } from "@/lib/actions/admin/partners.action";
import { imageProps } from "@/lib/images";
import { DeleteContentButton } from "@/components/admin/content/delete-content-button";
import {
  ContentEmptyState,
  ContentListHeader,
  ContentTable,
  EditLink,
  PublishedBadge,
} from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Partners",
};

export default async function AdminPartnersPage() {
  const partners = await getPartnersAdmin();

  return (
    <div>
      <ContentListHeader
        title="Partners"
        description="Shown in the Our Trusted Partners logo strip on the home page."
        count={partners.length}
        noun={["partner", "partners"]}
        addHref="/admin/partners/new"
        addLabel="Add Partner"
      />

      {partners.length === 0 ? (
        <ContentEmptyState message="No partners yet. The section is hidden on the site until you add one." />
      ) : (
        <ContentTable headers={["Partner", "Website", "Order", "Status", "Actions"]}>
          {partners.map((partner) => (
            <tr key={partner.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white">
                    <Image
                      {...imageProps(partner.logo)}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="font-medium text-blue">{partner.name}</span>
                </div>
              </td>
              <td className="max-w-56 truncate px-4 py-3 text-slate-500">
                {partner.websiteUrl ?? "-"}
              </td>
              <td className="px-4 py-3 text-slate-500">{partner.sortOrder}</td>
              <td className="px-4 py-3">
                <PublishedBadge isPublished={partner.isPublished} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <EditLink href={`/admin/partners/${partner.id}`} label={`Edit ${partner.name}`} />
                  <DeleteContentButton
                    action={deletePartner.bind(null, partner.id)}
                    itemName={partner.name}
                  />
                </div>
              </td>
            </tr>
          ))}
        </ContentTable>
      )}
    </div>
  );
}
