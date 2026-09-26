import type { Metadata } from "next";
import Image from "next/image";
import { deleteTeamMember, getTeamMembersAdmin } from "@/lib/actions/admin/team.action";
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
  title: "Team",
};

export default async function AdminTeamPage() {
  const members = await getTeamMembersAdmin();

  return (
    <div>
      <ContentListHeader
        title="Team"
        description="Shown in Meet Our Team on the About page."
        count={members.length}
        noun={["member", "members"]}
        addHref="/admin/team/new"
        addLabel="Add Member"
      />

      {members.length === 0 ? (
        <ContentEmptyState message="No team members yet. The section is hidden on the site until you add one." />
      ) : (
        <ContentTable headers={["Member", "Role", "Order", "Status", "Actions"]}>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue font-clash-display font-bold text-white">
                    {member.image ? (
                      <Image
                        {...imageProps(member.image)}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  <span className="font-medium text-blue">{member.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500">{member.role}</td>
              <td className="px-4 py-3 text-slate-500">{member.sortOrder}</td>
              <td className="px-4 py-3">
                <PublishedBadge isPublished={member.isPublished} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <EditLink href={`/admin/team/${member.id}`} label={`Edit ${member.name}`} />
                  <DeleteContentButton
                    action={deleteTeamMember.bind(null, member.id)}
                    itemName={member.name}
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
