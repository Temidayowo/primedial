import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { AdminBadge, AdminMobileNav, AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const email = session.user.email ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-6 lg:static lg:py-4">
        <div className="flex min-w-0 items-center gap-3">
          {/* Hamburger menu below lg; the sidebar takes over from lg up. */}
          <AdminMobileNav email={email} />
          <Link href="/admin" className="flex min-w-0 items-center gap-2">
            <span className="truncate font-clash-display text-base font-bold text-blue sm:text-lg">
              Prime Dial Solutions
            </span>
            <AdminBadge />
          </Link>
        </div>
        <p className="hidden truncate text-sm text-slate-500 sm:block">{email}</p>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
        <aside className="hidden shrink-0 lg:block lg:w-64 lg:border-r lg:border-gray-100 lg:bg-gray-50">
          <AdminSidebar />
        </aside>

        <main className="min-w-0 flex-1 bg-gray-50 px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
