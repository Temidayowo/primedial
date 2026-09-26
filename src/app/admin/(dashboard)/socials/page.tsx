import type { Metadata } from "next";
import {
  deleteSocialLink,
  getSocialLinksAdmin,
} from "@/lib/actions/admin/social-links.action";
import { SOCIAL_PLATFORM_LABELS } from "@/lib/social-platforms";
import { SocialIcon } from "@/components/social-icon";
import { DeleteContentButton } from "@/components/admin/content/delete-content-button";
import {
  ContentEmptyState,
  ContentListHeader,
  ContentTable,
  EditLink,
  PublishedBadge,
} from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Social Links",
};

export default async function AdminSocialLinksPage() {
  const links = await getSocialLinksAdmin();

  return (
    <div>
      <ContentListHeader
        title="Social Links"
        description="Shown as icons in the site footer. One link per platform."
        count={links.length}
        noun={["link", "links"]}
        addHref="/admin/socials/new"
        addLabel="Add Link"
      />

      {links.length === 0 ? (
        <ContentEmptyState message="No social links yet. The footer shows no social icons until you add one." />
      ) : (
        <ContentTable headers={["Platform", "URL", "Order", "Status", "Actions"]}>
          {links.map((link) => {
            const label = SOCIAL_PLATFORM_LABELS[link.platform];
            return (
              <tr key={link.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2.5 font-medium text-blue">
                    <SocialIcon platform={link.platform} className="size-4 shrink-0" />
                    {label}
                  </span>
                </td>
                <td className="max-w-64 truncate px-4 py-3">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-blue hover:underline"
                  >
                    {link.url}
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-500">{link.sortOrder}</td>
                <td className="px-4 py-3">
                  <PublishedBadge isPublished={link.isPublished} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <EditLink href={`/admin/socials/${link.id}`} label={`Edit ${label} link`} />
                    <DeleteContentButton
                      action={deleteSocialLink.bind(null, link.id)}
                      itemName={`${label} link`}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </ContentTable>
      )}
    </div>
  );
}
