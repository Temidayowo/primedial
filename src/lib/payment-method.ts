// Card and Bank Transfer both settle through Paystack under the hood
// (see src/lib/actions/payments.action.ts), just on different `channels`;
// OPay is a fully separate provider with its own hosted checkout. The UI
// never says "Paystack" - these read as three independent options.
export type PaymentMethodChoice = "card" | "bank_transfer" | "opay";
