"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import { resetPassword } from "@/lib/actions/password-reset.action";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    resetPassword.bind(null, token),
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (state?.success) {
    return (
      <div className="w-full max-w-sm">
        <h1 className="font-clash-display text-3xl font-bold text-blue">
          Password updated
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          Your password has been reset. You can now log in with your new
          password.
        </p>
        <Link
          href="/login"
          className="mt-6 block w-full rounded-lg bg-blue-500 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          Go to Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-clash-display text-3xl font-bold text-blue">
        Reset Password
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Choose a new password for your account.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="password"
            className="text-xs font-medium tracking-wide text-slate-500 uppercase"
          >
            New Password
          </label>
          <div className="relative mt-2">
            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a new password"
              required
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm text-blue placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {state?.errors?.password ? (
            <ul className="mt-1 space-y-0.5 text-xs text-red-500">
              {state.errors.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-xs text-slate-400">
              Use 8+ characters with a mix of letters, numbers &amp; symbols.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-xs font-medium tracking-wide text-slate-500 uppercase"
          >
            Confirm Password
          </label>
          <div className="relative mt-2">
            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              required
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm text-blue placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {state?.errors?.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {state.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
        >
          {isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
