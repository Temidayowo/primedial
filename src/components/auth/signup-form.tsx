"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import { signup, signInWithGoogle } from "@/lib/actions/auth.action";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A11.998 11.998 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.26A11.998 11.998 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-blue transition-colors hover:bg-slate-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-500">
          Log In
        </Link>
      </p>
    </div>
  );
}
