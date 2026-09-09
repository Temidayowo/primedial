import type { Metadata } from "next";
import { requireAdmin } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  return (
    <div className="p-10">
      <h1 className="font-clash-display text-2xl font-bold text-blue">
        Admin Dashboard
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Signed in as {session.user.email}.
      </p>
    </div>
  );
}
