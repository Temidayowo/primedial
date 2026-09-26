"use client";

import { startTransition, useActionState, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitInquiry, type InquiryFormState } from "@/lib/actions/inquiry.action";
import type { InquiryType } from "@/generated/prisma/enums";

// Shared plumbing for the public contact, consultation and service-request
// forms: submit, show field errors, and show a thank-you on success.

export function useInquiryForm(type: InquiryType) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    async (prev: InquiryFormState, formData: FormData) => {
      const result = await submitInquiry(type, prev, formData);
      if (result?.ok) formRef.current?.reset();
      return result;
    },
    undefined,
  );

  // Submitting through a transition (instead of <form action> alone)
  // keeps what the visitor typed when validation fails - React resets a
  // form after a <form action> submission.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  const errors = state && !state.ok ? state.errors : undefined;
  return { state, errors, isPending, formRef, formAction, onSubmit };
}

export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.[0]) return null;
  return <p className="text-xs text-red-600">{messages[0]}</p>;
}

export function FormStatus({ state }: { state: InquiryFormState }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <p
        role="status"
        className="mt-4 flex items-start gap-2 rounded-lg bg-green/10 px-3 py-2.5 text-sm text-green"
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        {state.message}
      </p>
    );
  }
  return state.message ? (
    <p role="alert" className="mt-4 text-sm text-red-600">
      {state.message}
    </p>
  ) : null;
}

// Hidden from people (and screen readers); bots that fill every field
// trip it. See submitInquiry.
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
