"use client";

import { useActionState } from "react";
import { resendVerificationEmail } from "@/lib/actions/verify-email.action";

export function ResendVerificationButton({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(
    resendVerificationEmail,
    undefined,
  );

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send a new link"}
      </button>
      {state?.message && (
        <p className="mt-2 text-center text-xs text-slate-400">{state.message}</p>
      )}
    </form>
  );
}
