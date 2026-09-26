// The shipping address as it was when an order was placed, stored on
// Order.shippingDetails. Orders must not depend on the customer's address
// book - deleting a saved address clears Order.shippingAddressId.
export interface ShippingDetails {
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
}

export function toShippingDetails(address: ShippingDetails): ShippingDetails {
  return {
    fullName: address.fullName,
    line1: address.line1,
    line2: address.line2 ?? null,
    city: address.city,
    state: address.state ?? null,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone ?? null,
  };
}

// Prefers the snapshot; falls back to the linked address for any order
// the migration backfill couldn't cover.
export function getOrderShippingDetails(order: {
  shippingDetails: unknown;
  shippingAddress?: ShippingDetails | null;
}): ShippingDetails | null {
  const snapshot = order.shippingDetails;
  if (snapshot && typeof snapshot === "object" && "line1" in snapshot) {
    return snapshot as ShippingDetails;
  }
  return order.shippingAddress ? toShippingDetails(order.shippingAddress) : null;
}
