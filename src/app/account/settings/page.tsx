import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ProfileSettingsForm } from "@/components/account/profile-settings-form";

export const metadata: Metadata = {
  title: "Profile Settings",
};

export default async function ProfileSettingsPage() {
  const session = await verifySession();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, password: true },
  });

  // A valid session cookie can still reference a user row that no longer
  // exists (e.g. the account was deleted elsewhere) - findUniqueOrThrow
  // would throw an unhandled 500 here instead of a clean redirect.
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Profile Settings
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage your account details.
      </p>

      <div className="mt-6">
        <ProfileSettingsForm
          name={user.name}
          email={user.email}
          hasPassword={!!user.password}
        />
      </div>
    </div>
  );
}
