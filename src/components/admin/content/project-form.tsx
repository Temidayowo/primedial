"use client";

import type { Project } from "@/generated/prisma/client";
import type { ContentFormState } from "@/lib/actions/admin/content-shared";
import {
  CheckboxField,
  ImageField,
  SortOrderField,
  SubmitButton,
  TextAreaField,
  TextField,
  useContentForm,
} from "./form-fields";

export function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (prevState: ContentFormState, formData: FormData) => Promise<ContentFormState>;
  project?: Project;
  submitLabel: string;
}) {
  const { state, formAction, isPending, onSubmit } = useContentForm(action);
  const errors = state?.errors;

  return (
    <form action={formAction} onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <TextField
        label="Title"
        name="title"
        required
        defaultValue={project?.title}
        placeholder="e.g. Greenwich Gardens Phase I & II"
        error={errors?.title}
      />

      <TextAreaField
        label="Summary"
        name="summary"
        required
        rows={3}
        defaultValue={project?.summary}
        hint="The sector and the work done."
        placeholder="e.g. Construction & Engineering - Setting Out, Piling, Topographical Survey"
        error={errors?.summary}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Location"
          name="location"
          required
          defaultValue={project?.location}
          placeholder="e.g. Kosofe, Lagos"
          error={errors?.location}
        />
        <TextField
          label="Year (optional)"
          name="year"
          type="number"
          min={1950}
          max={2100}
          defaultValue={project?.year ?? ""}
          hint='Shown as a badge. Left blank, the badge says "New".'
          error={errors?.year}
        />
      </div>

      <ImageField
        label="Image"
        name="image"
        required
        defaultValue={project?.image}
        error={errors?.image}
      />

      <SortOrderField defaultValue={project?.sortOrder} error={errors?.sortOrder} />

      <div className="space-y-3">
        <CheckboxField
          name="isPublished"
          label="Published"
          description="Show this project on the Services page."
          defaultChecked={project?.isPublished ?? true}
        />
        <CheckboxField
          name="isExample"
          label="Example project"
          description='Adds an "Example" badge. Use it for illustrative entries that are not real completed jobs.'
          defaultChecked={project?.isExample ?? false}
        />
      </div>

      <SubmitButton isPending={isPending} label={submitLabel} />
    </form>
  );
}
