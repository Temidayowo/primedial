import type { Metadata } from "next";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <Header
        theme="light"
        className="relative border-b border-gray-100 bg-white"
        mobileClassName="bg-white"
      />
      <div className="section-container max-w-3xl">
        <h1 className="font-clash-display text-3xl font-bold text-blue">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the
            Prime Dial Solutions website, products, and services. By creating
            an account or placing an order, you agree to these Terms.
          </p>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              1. Accounts
            </h2>
            <p className="mt-2">
              You&apos;re responsible for maintaining the confidentiality of
              your account credentials and for all activity under your
              account. Notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              2. Orders and Payment
            </h2>
            <p className="mt-2">
              All prices are listed in the currency shown at checkout and are
              subject to change without notice. We reserve the right to
              refuse or cancel any order at our discretion.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              3. Equipment Warranty
            </h2>
            <p className="mt-2">
              Surveying equipment sold through Prime Dial Solutions is
              covered by the manufacturer&apos;s warranty. Contact our
              support team for warranty claims or service requests.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              4. Limitation of Liability
            </h2>
            <p className="mt-2">
              Prime Dial Solutions is not liable for indirect, incidental, or
              consequential damages arising from the use of our products or
              services, to the maximum extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              5. Changes to These Terms
            </h2>
            <p className="mt-2">
              We may update these Terms from time to time. Continued use of
              the site after changes take effect constitutes acceptance of
              the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              6. Contact
            </h2>
            <p className="mt-2">
              Questions about these Terms can be sent through our{" "}
              <a href="/contact" className="text-blue-600 hover:text-blue-500">
                contact page
              </a>
              .
            </p>
          </section>

          <p className="pt-4 text-xs text-slate-400">
            This is placeholder content and has not been reviewed by legal
            counsel. Replace it with your finalized Terms of Service before
            launch.
          </p>
        </div>
      </div>
    </>
  );
}
