import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamMemberByIdAdmin, updateTeamMember } from "@/lib/actions/admin/team.action";
import { TeamMemberForm } from "@/components/admin/content/team-member-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Edit Team Member",
};

export default async function EditTeamMemberPage({ params }: PageProps<"/admin/team/[id]">) {
  const { id } = await params;
  const member = await getTeamMemberByIdAdmin(id);
  if (!member) notFound();

  return (
    <ContentFormPage title="Edit Team Member" backHref="/admin/team" backLabel="All team members">
      <TeamMemberForm
        action={updateTeamMember.bind(null, id)}
        member={member}
        submitLabel="Save Changes"
      />
    </ContentFormPage>
  );
}
