"use client";

import { startTransition, useActionState, useState } from "react";
import type { ContentFormState } from "@/lib/actions/admin/content-shared";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { imageProps, isValidImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";

// Building blocks for the CMS forms under /admin. Styling matches
// product-form.tsx so every admin form looks the same.

export const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-blue placeholder:text-slate-400 focus:border-blue focus:outline-none";
const labelClasses = "text-xs font-medium tracking-wide text-slate-500 uppercase";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClasses}>
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error?.[0] && <p className="mt-1 text-xs text-red-500">{error[0]}</p>}
    </div>
  );
}

export function TextField({
  label,
  name,
  hint,
  error,
  className,
  ...inputProps
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} htmlFor={name} hint={hint} error={error}>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        className={cn(inputClasses, className)}
        {...inputProps}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  name,
  hint,
  error,
  ...textareaProps
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string[];
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field label={label} htmlFor={name} hint={hint} error={error}>
      <textarea
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        className={inputClasses}
        {...textareaProps}
      />
    </Field>
  );
}

export function SortOrderField({
  defaultValue,
  error,
}: {
  defaultValue?: number;
  error?: string[];
}) {
  return (
    <TextField
      label="Display order"
      name="sortOrder"
      type="number"
      min={0}
      max={9999}
      step={1}
      defaultValue={defaultValue ?? 0}
      hint="Lower numbers show first. Entries with the same number show oldest first."
      error={error}
    />
  );
}

export function CheckboxField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-2.5 text-sm text-blue">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 rounded border-slate-300"
      />
      <span>
        {label}
        {description && (
          <span className="block text-xs text-slate-400">{description}</span>
        )}
      </span>
    </label>
  );
}

// Text input for an image path/URL with a live preview underneath, so
// a typo in the path shows up here instead of as a broken image on the
// public site.
export function ImageField({
  label,
  name,
  defaultValue,
  required,
  error,
  previewClassName,
  fit = "cover",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  error?: string[];
  previewClassName?: string;
  fit?: "cover" | "contain";
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = value.trim();
  const canPreview = src !== "" && isValidImageSrc(src);

  return (
    <Field
      label={label}
      htmlFor={name}
      hint="A path to a file in /public (e.g. /images/team/jane.jpg) or a full https:// URL."
      error={error}
    >
      <input
        id={name}
        name={name}
        value={value}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        placeholder="/images/example.jpg"
        aria-invalid={error ? true : undefined}
        className={inputClasses}
      />
      {canPreview && (
        <div
          className={cn(
            "relative mt-2 flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-gray-100",
            previewClassName ?? "aspect-video w-full max-w-xs",
          )}
        >
          {failedSrc === src ? (
            <p className="flex items-center gap-1.5 px-3 text-center text-xs text-red-500">
              <ImageOff className="size-4 shrink-0" />
              Couldn&apos;t load this image. Check the path.
            </p>
          ) : (
            <Image
              key={src}
              {...imageProps(src)}
              alt="Preview"
              fill
              sizes="320px"
              onError={() => setFailedSrc(src)}
              className={fit === "contain" ? "object-contain p-3" : "object-cover"}
            />
          )}
        </div>
      )}
    </Field>
  );
}

export function SubmitButton({
  isPending,
  label,
}: {
  isPending: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="rounded-lg bg-blue px-6 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue/90 disabled:opacity-60"
    >
      {isPending ? "Saving..." : label}
    </button>
  );
}

type ContentAction = (
  prevState: ContentFormState,
  formData: FormData,
) => Promise<ContentFormState>;

// useActionState plus a submit handler that runs the action in a
// transition instead of through <form action>. React resets a form after
// a <form action> submission, which would wipe everything the admin typed
// whenever validation fails. `formAction` is still returned for the
// form's `action` prop so the form works before JS loads.
export function useContentForm(action: ContentAction) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return { state, formAction, isPending, onSubmit };
}
