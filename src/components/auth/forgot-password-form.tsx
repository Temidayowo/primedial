"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { requestPasswordReset } from "@/lib/actions/password-reset.action";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    undefined,
  );

  if (state?.message) {
    return (
      <div className="w-full max-w-sm">
        <h1 className="font-clash-display text-3xl font-bold text-blue">
          Check your email
        </h1>
        <p className="mt-4 text-sm text-slate-500">{state.message}</p>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Back to log in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-clash-display text-3xl font-bold text-blue">
        Forgot Password
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Enter your email and we&apos;ll send you a link to reset your
        password.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="text-xs font-medium tracking-wide text-slate-500 uppercase"
          >
            Email
          </label>
          <div className="relative mt-2">
            <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-3 pl-10 text-sm text-blue placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-500">
          Log In
        </Link>
      </p>
    </div>
  );
}
