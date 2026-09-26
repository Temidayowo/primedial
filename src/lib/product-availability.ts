// Rules for what can go in the cart and through checkout.
export const MAX_CART_QUANTITY = 99;

export function isPurchasable(product: { inStock: boolean }) {
  return product.inStock;
}
