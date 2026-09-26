import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectByIdAdmin, updateProject } from "@/lib/actions/admin/projects.action";
import { ProjectForm } from "@/components/admin/content/project-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Edit Project",
};

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);
  if (!project) notFound();

  return (
    <ContentFormPage title="Edit Project" backHref="/admin/projects" backLabel="All projects">
      <ProjectForm
        action={updateProject.bind(null, id)}
        project={project}
        submitLabel="Save Changes"
      />
    </ContentFormPage>
  );
}
