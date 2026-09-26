"use client";

import type { Partner } from "@/generated/prisma/client";
import type { ContentFormState } from "@/lib/actions/admin/content-shared";
import {
  CheckboxField,
  ImageField,
  SortOrderField,
  SubmitButton,
  TextField,
  useContentForm,
} from "./form-fields";

export function PartnerForm({
  action,
  partner,
  submitLabel,
}: {
  action: (prevState: ContentFormState, formData: FormData) => Promise<ContentFormState>;
  partner?: Partner;
  submitLabel: string;
}) {
  const { state, formAction, isPending, onSubmit } = useContentForm(action);
  const errors = state?.errors;

  return (
    <form action={formAction} onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <TextField
        label="Name"
        name="name"
        required
        defaultValue={partner?.name}
        hint="Used as the logo's alt text."
        error={errors?.name}
      />

      <ImageField
        label="Logo"
        name="logo"
        required
        defaultValue={partner?.logo}
        error={errors?.logo}
        fit="contain"
        previewClassName="h-24 w-64"
      />

      <TextField
        label="Website (optional)"
        name="websiteUrl"
        type="url"
        defaultValue={partner?.websiteUrl ?? ""}
        placeholder="https://..."
        hint="If set, the logo links to this site."
        error={errors?.websiteUrl}
      />

      <SortOrderField defaultValue={partner?.sortOrder} error={errors?.sortOrder} />

      <CheckboxField
        name="isPublished"
        label="Published"
        description="Show this logo in Our Trusted Partners on the home page."
        defaultChecked={partner?.isPublished ?? true}
      />

      <SubmitButton isPending={isPending} label={submitLabel} />
    </form>
  );
}
