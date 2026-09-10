// Flat estimates - no real tax/shipping-rate API is wired up. Kept in
// one place so the cart page (client-side preview) and checkout
// (server-side, authoritative) compute the same numbers. Not colocated
// in cart.action.ts because a "use server" file can only export async
// functions, not plain constants.
export const TAX_RATE = 0.075; // 7.5%
export const FLAT_SHIPPING = 5000; // NGN
