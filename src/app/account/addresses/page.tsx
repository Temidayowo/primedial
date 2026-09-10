import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { getAddresses } from "@/lib/actions/addresses.action";
import { ManageAddresses } from "@/components/account/manage-addresses";

export const metadata: Metadata = {
  title: "Saved Addresses",
};

export default async function AddressesPage() {
  const session = await verifySession();
  const addresses = await getAddresses(session.user.id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Saved Addresses
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage the shipping addresses on your account.
      </p>

      <div className="mt-6">
        <ManageAddresses addresses={addresses} />
      </div>
    </div>
  );
}
