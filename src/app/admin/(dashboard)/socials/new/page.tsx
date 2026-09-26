import type { Metadata } from "next";
import {
  createSocialLink,
  getSocialLinksAdmin,
} from "@/lib/actions/admin/social-links.action";
import { SocialLinkForm } from "@/components/admin/content/social-link-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Add Social Link",
};

export default async function NewSocialLinkPage() {
  const existing = await getSocialLinksAdmin();

  return (
    <ContentFormPage title="Add Social Link" backHref="/admin/socials" backLabel="All social links">
      <SocialLinkForm
        action={createSocialLink}
        takenPlatforms={existing.map((link) => link.platform)}
        submitLabel="Add Link"
      />
    </ContentFormPage>
  );
}
