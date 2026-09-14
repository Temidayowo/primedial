import Link from "next/link";

export function CheckoutFooter() {
  return (
    <footer className="border-t border-gray-100 px-6 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
        <p>
          &copy; {new Date().getFullYear()} Prime Dial Solutions. All rights
          reserved.
        </p>
        <Link href="/contact" className="text-slate-500 hover:text-blue">
          Need help? Contact support
        </Link>
      </div>
    </footer>
  );
}
