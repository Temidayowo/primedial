"use client";

import type { Testimonial } from "@/generated/prisma/client";
import type { ContentFormState } from "@/lib/actions/admin/content-shared";
import {
  CheckboxField,
  Field,
  SortOrderField,
  SubmitButton,
  TextAreaField,
  TextField,
  inputClasses,
  useContentForm,
} from "./form-fields";

const RATINGS = [5, 4, 3, 2, 1];

export function TestimonialForm({
  action,
  testimonial,
  submitLabel,
}: {
  action: (prevState: ContentFormState, formData: FormData) => Promise<ContentFormState>;
  testimonial?: Testimonial;
  submitLabel: string;
}) {
  const { state, formAction, isPending, onSubmit } = useContentForm(action);
  const errors = state?.errors;

  return (
    <form action={formAction} onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Client name"
          name="name"
          required
          defaultValue={testimonial?.name}
          error={errors?.name}
        />
        <TextField
          label="Role / company"
          name="role"
          required
          defaultValue={testimonial?.role}
          placeholder="e.g. Project Manager, CT Edge Construction"
          error={errors?.role}
        />
      </div>

      <TextAreaField
        label="Testimonial"
        name="content"
        required
        rows={5}
        defaultValue={testimonial?.content}
        error={errors?.content}
      />

      <Field label="Rating" htmlFor="rating" error={errors?.rating}>
        <select
          id="rating"
          name="rating"
          defaultValue={testimonial?.rating ?? 5}
          className={`${inputClasses} sm:max-w-40`}
        >
          {RATINGS.map((rating) => (
            <option key={rating} value={rating}>
              {rating} {rating === 1 ? "star" : "stars"}
            </option>
          ))}
        </select>
      </Field>

      <SortOrderField defaultValue={testimonial?.sortOrder} error={errors?.sortOrder} />

      <CheckboxField
        name="isPublished"
        label="Published"
        description="Show this testimonial on the home page."
        defaultChecked={testimonial?.isPublished ?? true}
      />

      <SubmitButton isPending={isPending} label={submitLabel} />
    </form>
  );
}
