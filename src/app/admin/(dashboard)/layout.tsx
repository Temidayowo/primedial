import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <Link href="/admin" className="font-clash-display text-lg font-bold text-blue">
          Prime Dial Solutions <span className="text-blue-500">Admin</span>
        </Link>
        <p className="text-sm text-slate-500">{session.user.email}</p>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
        <aside className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white lg:static lg:z-auto lg:w-64 lg:border-r lg:border-b-0 lg:bg-gray-50">
          <AdminSidebar />
        </aside>

        <main className="flex-1 bg-gray-50 px-6 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
