// Converts a naira amount (what's stored on Order.total) to the kobo
// integer both Paystack and OPay expect. Rounded because Decimal -> Number
// can carry float dust (e.g. 4999.9999999999).
export function toKobo(nairaAmount: number) {
  return Math.round(nairaAmount * 100);
}
