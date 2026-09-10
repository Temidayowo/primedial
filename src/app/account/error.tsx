"use client";

import Link from "next/link";

export default function AccountError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-clash-display text-2xl font-bold text-blue">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          We couldn&apos;t load your account. This is usually temporary.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            Try Again
          </button>
          <Link
            href="/login"
            className="text-sm text-slate-500 hover:text-blue"
          >
            Log out and sign in again
          </Link>
        </div>
      </div>
    </div>
  );
}
