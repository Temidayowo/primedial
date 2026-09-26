import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { getPaymentMethods } from "@/lib/queries/payment-methods";
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
        Cards you&apos;ve paid with are saved here automatically so you can
        check out faster next time - we never store a full card number or
        CVV.
      </p>

      <div className="mt-6">
        <ManagePaymentMethods paymentMethods={paymentMethods} />
      </div>
    </div>
  );
}
