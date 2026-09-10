import Header from "@/components/header";
import { AccountSidebar } from "@/components/account/sidebar";
import { verifySession } from "@/lib/dal";

export default async function AccountLayout({
  children,
}: LayoutProps<"/account">) {
  await verifySession();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header
        theme="light"
        className="relative border-b border-gray-100 bg-white"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-slate-200 lg:w-64 lg:border-r">
          <AccountSidebar />
        </aside>

        <main className="flex-1 px-6 py-8 md:px-8">{children}</main>
      </div>

      <footer className="border-t border-slate-200 px-6 py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Prime Dial Solutions. All rights
        reserved.
      </footer>
    </div>
  );
}
