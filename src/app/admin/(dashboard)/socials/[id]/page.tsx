import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSocialLinkByIdAdmin,
  getSocialLinksAdmin,
  updateSocialLink,
} from "@/lib/actions/admin/social-links.action";
import { SocialLinkForm } from "@/components/admin/content/social-link-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Edit Social Link",
};

export default async function EditSocialLinkPage({ params }: PageProps<"/admin/socials/[id]">) {
  const { id } = await params;
  const [link, allLinks] = await Promise.all([getSocialLinkByIdAdmin(id), getSocialLinksAdmin()]);
  if (!link) notFound();

  return (
    <ContentFormPage title="Edit Social Link" backHref="/admin/socials" backLabel="All social links">
      <SocialLinkForm
        action={updateSocialLink.bind(null, id)}
        link={link}
        takenPlatforms={allLinks
          .filter((other) => other.id !== link.id)
          .map((other) => other.platform)}
        submitLabel="Save Changes"
      />
    </ContentFormPage>
  );
}
