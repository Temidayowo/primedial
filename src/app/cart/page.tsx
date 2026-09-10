import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductList from "@/components/shared/product/productList";
import { verifySession } from "@/lib/dal";
import { getCart } from "@/lib/actions/cart.action";
import { getFeaturedProducts } from "@/lib/actions/products.action";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { EmptyCart } from "@/components/cart/empty-cart";

export const metadata: Metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const session = await verifySession();
  const [{ items, subtotal }, featured] = await Promise.all([
    getCart(session.user.id),
    getFeaturedProducts(),
  ]);

  const cartProductIds = new Set(items.map((item) => item.productId));
  const recommended = featured
    .filter((product) => !cartProductIds.has(product.id))
    .slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-blue">
      <Header theme="dark" className="relative bg-blue" />

      <main className="flex-1">
        <div className="section-container">
          <h1 className="font-clash-display text-2xl font-bold text-white md:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {items.length} {items.length === 1 ? "item" : "items"} in your
            cart.
          </p>

          {items.length === 0 ? (
            <div className="mt-8">
              <EmptyCart />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    id={item.id}
                    productSlug={item.product.slug}
                    productName={item.product.name}
                    productImage={item.product.images[0]}
                    unitPrice={Number(item.product.price)}
                    quantity={item.quantity}
                  />
                ))}
              </div>

              <OrderSummary subtotal={subtotal} />
            </div>
          )}
        </div>

        {recommended.length > 0 && (
          <div className="section-container border-t border-white/10">
            <h2 className="font-clash-display text-lg font-bold text-white">
              You May Also Like
            </h2>
            <ProductList data={recommended} limit={4} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
