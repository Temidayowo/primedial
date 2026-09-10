import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { getPaymentMethods } from "@/lib/actions/payment-methods.action";
import { ManagePaymentMethods } from "@/components/account/manage-payment-methods";

export const metadata: Metadata = {
  title: "Payment Methods",
};

export default async function PaymentMethodsPage() {
  const session = await verifySession();
  const paymentMethods = await getPaymentMethods(session.user.id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Payment Methods
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        No online checkout is set up yet, so this only stores a label for
        your records - never a full card number.
      </p>

      <div className="mt-6">
        <ManagePaymentMethods paymentMethods={paymentMethods} />
      </div>
    </div>
  );
}
