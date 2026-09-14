import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";

export function CheckoutHeader() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8 lg:px-12">
        <Link href="/" aria-label="Prime Dial Solutions home">
          <Image
            src="/images/logo/primedial-logo.png"
            alt="Primedial Logo"
            width={359}
            height={247}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        <div className="flex items-center gap-1.5 rounded-full bg-green/10 px-3 py-1.5 text-xs font-medium text-green sm:text-sm">
          <Lock className="size-3.5" />
          <span>Secure Checkout</span>
        </div>
      </div>
    </header>
  );
}
