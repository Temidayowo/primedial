import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/header";
import { PageHero } from "@/components/ui/pageHero";
import { TrackOrderForm, TrackOrderFromUrl } from "@/components/orders/track-order-form";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the delivery status of your Prime Dial Solutions order.",
};

export default function TrackOrderPage() {
  return (
    <>
      <Header
        theme="dark"
        mobileClassName="absolute top-0 left-0 z-50 w-full bg-transparent border-b-0"
      />
      <PageHero
        heading="Track Your Order"
        subheading="Enter your order number and the email you ordered with to see where your equipment is."
        breadcrumb="Home / Track Order"
        backgroundImage="/images/about-hero.jpg"
      />
      <section className="bg-gray-50">
        <div className="section-container max-w-4xl">
          {/* The form reads ?order= - on this prerendered page that needs a
              Suspense boundary; the empty form is its fallback. */}
          <Suspense fallback={<TrackOrderForm />}>
            <TrackOrderFromUrl />
          </Suspense>
          <p className="mt-8 text-center text-sm text-slate-500">
            Your order number is in your confirmation email. Signed-in customers can also see every
            order under{" "}
            <Link href="/account/orders" className="font-medium text-blue-600 hover:underline">
              My Orders
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
