"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { authenticate, type LoginContext } from "@/lib/actions/auth.action";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";

interface LoginFormProps {
  context?: LoginContext;
}

export function LoginForm({ context = "user" }: LoginFormProps) {
  const isAdmin = context === "admin";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate.bind(null, context),
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-clash-display text-3xl font-bold text-blue">
        {isAdmin ? "Admin Login" : "Welcome Back"}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        {isAdmin
          ? "Sign in with your administrator account."
          : "Log in to your Prime Dial Solutions account."}
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

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium tracking-wide text-slate-500 uppercase"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-2">
            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={8}
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
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-slate-300 accent-blue-500"
          />
          Remember me for 30 days
        </label>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="min-h-5 text-sm text-red-500"
        >
          {errorMessage && <p>{errorMessage}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
        >
          {isPending ? "Logging in..." : "Log In"}
        </button>
      </form>

      {!isAdmin && (
        <>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleSignInButton />

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-500">
              Sign Up
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
