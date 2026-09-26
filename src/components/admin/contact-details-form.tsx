"use client";

import { startTransition, useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  updateContactDetails,
  type ContactDetailsFormState,
} from "@/lib/actions/admin/site-settings.action";
import type { ContactDetails } from "@/lib/site-settings";
import { Field, inputClasses, SubmitButton } from "@/components/admin/content/form-fields";

const MAX_PHONES = 4;

export function ContactDetailsForm({ details }: { details: ContactDetails }) {
  const [state, formAction, isPending] = useActionState<ContactDetailsFormState, FormData>(
    updateContactDetails,
    undefined,
  );
  const [phones, setPhones] = useState(details.phones.length > 0 ? details.phones : [""]);
  const errors = state && !state.ok ? state.errors : undefined;

  // Submitted through a transition so the fields keep their values when
  // validation fails.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <Field label="Address" htmlFor="address" error={errors?.address}>
        <textarea
          id="address"
          name="address"
          rows={2}
          required
          defaultValue={details.address}
          className={inputClasses}
        />
      </Field>

      <Field
        label="Phone numbers"
        htmlFor="phone-0"
        hint="Shown on the contact page. The first one also appears in the footer and in order emails."
        error={errors?.phones}
      >
        <div className="space-y-2">
          {phones.map((phone, index) => (
            <div key={index} className="flex gap-2">
              <input
                id={`phone-${index}`}
                name="phones"
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhones((prev) => prev.map((p, i) => (i === index ? e.target.value : p)))
                }
                placeholder="+234 800 000 0000"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => setPhones((prev) => prev.filter((_, i) => i !== index))}
                disabled={phones.length === 1}
                aria-label="Remove phone number"
                className="shrink-0 rounded-lg border border-slate-200 p-2.5 text-slate-400 hover:text-red-500 disabled:opacity-40"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
        {phones.length < MAX_PHONES && (
          <button
            type="button"
            onClick={() => setPhones((prev) => [...prev, ""])}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          >
            <Plus className="size-3.5" /> Add phone number
          </button>
        )}
      </Field>

      <Field label="Email" htmlFor="email" error={errors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={details.email}
          className={inputClasses}
        />
      </Field>

      <Field
        label="Business hours"
        htmlFor="businessHours"
        hint='e.g. "Mon-Fri, 8:00am-6:00pm"'
        error={errors?.businessHours}
      >
        <input
          id="businessHours"
          name="businessHours"
          required
          defaultValue={details.businessHours}
          className={inputClasses}
        />
      </Field>

      <Field
        label="Map embed link (optional)"
        htmlFor="mapEmbedUrl"
        hint="In Google Maps: Share > Embed a map > copy the link inside src=&quot;...&quot;. Leave empty to show a map of the address above."
        error={errors?.mapEmbedUrl}
      >
        <input
          id="mapEmbedUrl"
          name="mapEmbedUrl"
          type="url"
          defaultValue={details.mapEmbedUrl ?? ""}
          placeholder="https://www.google.com/maps/embed?pb=..."
          className={inputClasses}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton isPending={isPending} label="Save Contact Details" />
        {state?.message && (
          <p role="status" className={state.ok ? "text-sm text-green" : "text-sm text-red-600"}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
