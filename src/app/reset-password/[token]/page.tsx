import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default async function ResetPasswordPage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await props.params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <ResetPasswordForm token={token} />
    </div>
  );
}
