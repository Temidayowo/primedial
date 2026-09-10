import Header from "@/components/header";
import { AccountSidebar } from "@/components/account/sidebar";
import { verifySession } from "@/lib/dal";

export default async function AccountLayout({
  children,
}: LayoutProps<"/account">) {
  await verifySession();

  return (
    <div className="flex min-h-screen flex-col bg-blue">
      <Header theme="dark" className="relative bg-blue" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-white/10 lg:w-64 lg:border-r">
          <AccountSidebar />
        </aside>

        <main className="flex-1 px-6 py-8 md:px-8">{children}</main>
      </div>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Prime Dial Solutions. All rights
        reserved.
      </footer>
    </div>
  );
}
