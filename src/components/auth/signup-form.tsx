"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import { signup } from "@/lib/actions/auth.action";
import { resendVerificationEmail } from "@/lib/actions/verify-email.action";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [resendState, resendAction, isResending] = useActionState(
    resendVerificationEmail,
    undefined,
  );

  if (state?.verificationSent) {
    return (
      <div className="w-full max-w-sm">
        <h1 className="font-clash-display text-3xl font-bold text-blue">
          Check your email
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          We sent a verification link to <strong>{email}</strong>. Click it
          to activate your account, then log in.
        </p>

        <form action={resendAction} className="mt-6">
          <input type="hidden" name="email" value={email} />
          <button
            type="submit"
            disabled={isResending}
            className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-60"
          >
            {isResending ? "Sending..." : "Didn't get it? Resend"}
          </button>
          {resendState?.message && (
            <p className="mt-2 text-xs text-slate-400">{resendState.message}</p>
          )}
        </form>

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
        Create Your Account
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Join{" "}
        <Link href="/" className="text-blue-600 hover:text-blue-500">
          Prime Dial Solutions
        </Link>{" "}
        to get started.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="name"
            className="text-xs font-medium tracking-wide text-slate-500 uppercase"
          >
            Full Name
          </label>
          <div className="relative mt-2">
            <UserIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-3 pl-10 text-sm text-blue placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          {state?.errors?.name && (
            <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
          )}
        </div>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-3 pl-10 text-sm text-blue placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          {state?.errors?.email && (
            <p className="mt-1 text-xs text-red-500">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-xs font-medium tracking-wide text-slate-500 uppercase"
          >
            Password
          </label>
          <div className="relative mt-2">
            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
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
              placeholder="Re-enter your password"
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

        <div>
          <label className="flex items-start gap-2 text-sm text-slate-500">
            <input
              type="checkbox"
              name="terms"
              required
              className="mt-0.5 size-4 rounded border-slate-300 accent-blue-500"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </span>
          </label>
          {state?.errors?.terms && (
            <p className="mt-1 text-xs text-red-500">{state.errors.terms[0]}</p>
          )}
        </div>

        {state?.message && (
          <div aria-live="polite" className="text-sm text-red-500">
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
        >
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <GoogleSignInButton />

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-500">
          Log In
        </Link>
      </p>
    </div>
  );
}
