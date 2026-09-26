import type { Metadata } from "next";
import { createProject } from "@/lib/actions/admin/projects.action";
import { ProjectForm } from "@/components/admin/content/project-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Add Project",
};

export default function NewProjectPage() {
  return (
    <ContentFormPage title="Add Project" backHref="/admin/projects" backLabel="All projects">
      <ProjectForm action={createProject} submitLabel="Create Project" />
    </ContentFormPage>
  );
}
