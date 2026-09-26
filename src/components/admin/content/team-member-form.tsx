"use client";

import type { TeamMember } from "@/generated/prisma/client";
import type { ContentFormState } from "@/lib/actions/admin/content-shared";
import {
  CheckboxField,
  ImageField,
  SortOrderField,
  SubmitButton,
  TextField,
  useContentForm,
} from "./form-fields";

export function TeamMemberForm({
  action,
  member,
  submitLabel,
}: {
  action: (prevState: ContentFormState, formData: FormData) => Promise<ContentFormState>;
  member?: TeamMember;
  submitLabel: string;
}) {
  const { state, formAction, isPending, onSubmit } = useContentForm(action);
  const errors = state?.errors;

  return (
    <form action={formAction} onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Name"
          name="name"
          required
          defaultValue={member?.name}
          error={errors?.name}
        />
        <TextField
          label="Role"
          name="role"
          required
          defaultValue={member?.role}
          placeholder="e.g. Chief Surveyor"
          error={errors?.role}
        />
      </div>

      <ImageField
        label="Photo (optional)"
        name="image"
        defaultValue={member?.image}
        error={errors?.image}
        previewClassName="aspect-square w-40"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="LinkedIn URL (optional)"
          name="linkedinUrl"
          type="url"
          defaultValue={member?.linkedinUrl ?? ""}
          placeholder="https://www.linkedin.com/in/..."
          error={errors?.linkedinUrl}
        />
        <TextField
          label="Email (optional)"
          name="email"
          type="email"
          defaultValue={member?.email ?? ""}
          error={errors?.email}
        />
      </div>

      <SortOrderField defaultValue={member?.sortOrder} error={errors?.sortOrder} />

      <CheckboxField
        name="isPublished"
        label="Published"
        description="Show this person in Meet Our Team on the About page."
        defaultChecked={member?.isPublished ?? true}
      />

      <SubmitButton isPending={isPending} label={submitLabel} />
    </form>
  );
}
