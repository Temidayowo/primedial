import type { Metadata } from "next";
import Image from "next/image";
import { deleteProject, getProjectsAdmin } from "@/lib/actions/admin/projects.action";
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
  title: "Projects",
};

export default async function AdminProjectsPage() {
  const projects = await getProjectsAdmin();

  return (
    <div>
      <ContentListHeader
        title="Projects"
        description="Shown in Expertise In Action on the Services page."
        count={projects.length}
        noun={["project", "projects"]}
        addHref="/admin/projects/new"
        addLabel="Add Project"
      />

      {projects.length === 0 ? (
        <ContentEmptyState message="No projects yet. The section is hidden on the site until you add one." />
      ) : (
        <ContentTable headers={["Project", "Location", "Year", "Order", "Status", "Actions"]}>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      {...imageProps(project.image)}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-blue">{project.title}</p>
                    {project.isExample && (
                      <p className="text-[11px] font-medium text-amber-600 uppercase">
                        Example
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500">{project.location}</td>
              <td className="px-4 py-3 text-slate-500">{project.year ?? "-"}</td>
              <td className="px-4 py-3 text-slate-500">{project.sortOrder}</td>
              <td className="px-4 py-3">
                <PublishedBadge isPublished={project.isPublished} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <EditLink href={`/admin/projects/${project.id}`} label={`Edit ${project.title}`} />
                  <DeleteContentButton
                    action={deleteProject.bind(null, project.id)}
                    itemName={project.title}
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
