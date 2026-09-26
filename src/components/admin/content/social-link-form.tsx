"use client";

import type { SocialLink } from "@/generated/prisma/client";
import { SocialPlatform } from "@/generated/prisma/enums";
import type { ContentFormState } from "@/lib/actions/admin/content-shared";
import { SOCIAL_PLATFORM_LABELS } from "@/lib/social-platforms";
import {
  CheckboxField,
  Field,
  SortOrderField,
  SubmitButton,
  TextField,
  inputClasses,
  useContentForm,
} from "./form-fields";

export function SocialLinkForm({
  action,
  link,
  takenPlatforms,
  submitLabel,
}: {
  action: (prevState: ContentFormState, formData: FormData) => Promise<ContentFormState>;
  link?: SocialLink;
  // Platforms that already have a link (other than this one) - there can
  // only be one link per platform, so these are left out of the picker.
  takenPlatforms: SocialPlatform[];
  submitLabel: string;
}) {
  const { state, formAction, isPending, onSubmit } = useContentForm(action);
  const errors = state?.errors;
  const availablePlatforms = Object.values(SocialPlatform).filter(
    (platform) => !takenPlatforms.includes(platform),
  );

  if (availablePlatforms.length === 0) {
    return (
      <p className="max-w-2xl rounded-xl border border-dashed border-gray-200 p-6 text-sm text-slate-500">
        Every supported platform already has a link. Edit an existing one instead.
      </p>
    );
  }

  return (
    <form action={formAction} onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <Field label="Platform" htmlFor="platform" error={errors?.platform}>
        <select
          id="platform"
          name="platform"
          required
          defaultValue={link?.platform ?? ""}
          className={`${inputClasses} sm:max-w-60`}
        >
          <option value="" disabled>
            Select a platform
          </option>
          {availablePlatforms.map((platform) => (
            <option key={platform} value={platform}>
              {SOCIAL_PLATFORM_LABELS[platform]}
            </option>
          ))}
        </select>
      </Field>

      <TextField
        label="Profile URL"
        name="url"
        type="url"
        required
        defaultValue={link?.url}
        placeholder="https://..."
        hint="For WhatsApp, use a https://wa.me/234... link."
        error={errors?.url}
      />

      <SortOrderField defaultValue={link?.sortOrder} error={errors?.sortOrder} />

      <CheckboxField
        name="isPublished"
        label="Published"
        description="Show this icon in the site footer."
        defaultChecked={link?.isPublished ?? true}
      />

      <SubmitButton isPending={isPending} label={submitLabel} />
    </form>
  );
}
