"use client";

import { useState } from "react";
import { SHIPPING_METHODS, type ShippingMethodId } from "@/lib/cart-constants";
import { AddressSection } from "./address-section";
import { ShippingMethodSection } from "./shipping-method-section";
import { PaymentSection } from "./payment-section";
import { OrderSummarySidebar } from "./order-summary-sidebar";
import { TrustBadges } from "./trust-badges";
import { SectionCard } from "./section-card";
import type { PaymentMethodChoice } from "@/lib/payment-method";

interface Address {
  id: string;
  label: string | null;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  paystackAuthorizationCode: string | null;
}

interface CheckoutItem {
  id: string;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
}

export function CheckoutClient({
  items,
  subtotal,
  addresses,
  paymentMethods,
}: {
  items: CheckoutItem[];
  subtotal: number;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}) {
  // Holds only an explicit user pick. The effective selection (below) falls
  // back to the account's default whenever there's no pick yet, or the
  // picked row was just removed - computed during render instead of synced
  // via an effect, so adding/removing a saved address (which arrives as
  // fresh props via router.refresh()) never needs a setState cascade.
  const [addressOverride, setAddressOverride] = useState<string | null>(null);
  const [selectedShippingId, setSelectedShippingId] =
    useState<ShippingMethodId>(SHIPPING_METHODS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodChoice>("card");
  // undefined = no explicit pick yet (falls back to the default saved
  // card, if any); null = explicitly chose "use a new card".
  const [savedCardOverride, setSavedCardOverride] = useState<
    string | null | undefined
  >(undefined);

  const selectedAddressId =
    addressOverride && addresses.some((a) => a.id === addressOverride)
      ? addressOverride
      : (addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null);

  const chargeableCards = paymentMethods.filter((m) => m.paystackAuthorizationCode);
  const defaultCardId =
    chargeableCards.find((m) => m.isDefault)?.id ?? chargeableCards[0]?.id ?? null;

  const selectedSavedCardId =
    savedCardOverride === undefined
      ? defaultCardId
      : savedCardOverride === null || chargeableCards.some((m) => m.id === savedCardOverride)
        ? savedCardOverride
        : defaultCardId;

  const shippingCost =
    SHIPPING_METHODS.find((m) => m.id === selectedShippingId)?.cost ??
    SHIPPING_METHODS[0].cost;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <SectionCard step={1} title="Shipping Address">
          <AddressSection
            addresses={addresses}
            selectedId={selectedAddressId}
            onSelect={setAddressOverride}
          />
        </SectionCard>

        <SectionCard step={2} title="Shipping Method">
          <ShippingMethodSection
            selectedId={selectedShippingId}
            onSelect={setSelectedShippingId}
          />
        </SectionCard>

        <SectionCard step={3} title="Payment">
          <PaymentSection
            paymentMethods={paymentMethods}
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
            selectedSavedCardId={selectedSavedCardId}
            onSelectSavedCard={setSavedCardOverride}
          />
          <div className="mt-5 border-t border-gray-100 pt-5">
            <TrustBadges />
          </div>
        </SectionCard>
      </div>

      <OrderSummarySidebar
        items={items}
        subtotal={subtotal}
        shippingCost={shippingCost}
        shippingMethodId={selectedShippingId}
        selectedAddressId={selectedAddressId}
        paymentMethod={paymentMethod}
        selectedSavedCardId={paymentMethod === "card" ? selectedSavedCardId : null}
      />
    </div>
  );
}
