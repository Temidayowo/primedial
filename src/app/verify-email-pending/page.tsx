import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ResendVerificationButton } from "@/components/auth/resend-verification-button";

export const metadata: Metadata = {
  title: "Verify Your Email",
};

export default async function VerifyEmailPendingPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-clash-display text-3xl font-bold text-blue">
          Check your email
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          We sent a verification link to{" "}
          <strong>{session.user.email}</strong>. Click it to finish setting
          up your account.
        </p>

        <ResendVerificationButton email={session.user.email} />

        <p className="mt-6 text-sm text-slate-500">
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            Continue to the site
          </Link>
        </p>
      </div>
    </div>
  );
}
