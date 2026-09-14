import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getCart } from "@/lib/actions/cart.action";
import { getAddresses } from "@/lib/actions/addresses.action";
import { getPaymentMethods } from "@/lib/actions/payment-methods.action";
import { CheckoutHeader } from "@/components/checkout/checkout-header";
import { CheckoutFooter } from "@/components/checkout/checkout-footer";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = await verifySession();
  const [{ items, subtotal }, addresses, paymentMethods] = await Promise.all([
    getCart(session.user.id),
    getAddresses(session.user.id),
    getPaymentMethods(session.user.id),
  ]);

  if (items.length === 0) {
    redirect("/cart");
  }

  const checkoutItems = items.map((item) => ({
    id: item.id,
    name: item.product.name,
    image: item.product.images[0],
    unitPrice: Number(item.product.price),
    quantity: item.quantity,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <CheckoutHeader />

      <main className="flex-1">
        <div className="section-container">
          <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {items.length} {items.length === 1 ? "item" : "items"} &middot;
            complete your order below.
          </p>

          <div className="mt-8">
            <CheckoutClient
              items={checkoutItems}
              subtotal={subtotal}
              addresses={addresses}
              paymentMethods={paymentMethods}
            />
          </div>
        </div>
      </main>

      <CheckoutFooter />
    </div>
  );
}
