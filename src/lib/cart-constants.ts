// Flat estimates - no real tax/shipping-rate API is wired up. Kept in
// one place so the cart page (client-side preview) and checkout
// (server-side, authoritative) compute the same numbers. Not colocated
// in cart.action.ts because a "use server" file can only export async
// functions, not plain constants.
export const TAX_RATE = 0.075; // 7.5%
export const FLAT_SHIPPING = 5000; // NGN

// Shown as selectable options on /checkout. The first entry's cost
// matches FLAT_SHIPPING so the cart page's preview total and the
// checkout page's default selection agree.
export const SHIPPING_METHODS = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "5-7 business days",
    cost: FLAT_SHIPPING,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "2-3 business days",
    cost: 12000,
  },
  {
    id: "priority",
    name: "Priority Overnight",
    description: "Next business day",
    cost: 25000,
  },
] as const;

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];
