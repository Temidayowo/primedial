import type { Metadata } from "next";
import Link from "next/link";
import { verifyEmail } from "@/lib/actions/verify-email.action";
import { ResendVerificationButton } from "@/components/auth/resend-verification-button";
import { AutoRedirect } from "@/components/auth/auto-redirect";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function VerifyEmailPage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await props.params;
  const result = await verifyEmail(token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-clash-display text-3xl font-bold text-blue">
          {result.success ? "Email verified" : "Verification failed"}
        </h1>
        <p className="mt-4 text-sm text-slate-500">{result.message}</p>

        {result.success ? (
          <>
            <Link
              href="/login"
              className="mt-6 block w-full rounded-lg bg-blue-500 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              Go to Log In
            </Link>
            <AutoRedirect to="/login" />
          </>
        ) : result.email ? (
          <ResendVerificationButton email={result.email} />
        ) : (
          <p className="mt-6 text-sm text-slate-500">
            <Link href="/signup" className="text-blue-600 hover:text-blue-500">
              Create a new account
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
