import type { Metadata } from "next";
import { createTeamMember } from "@/lib/actions/admin/team.action";
import { TeamMemberForm } from "@/components/admin/content/team-member-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Add Team Member",
};

export default function NewTeamMemberPage() {
  return (
    <ContentFormPage title="Add Team Member" backHref="/admin/team" backLabel="All team members">
      <TeamMemberForm action={createTeamMember} submitLabel="Add Member" />
    </ContentFormPage>
  );
}
