import type { Metadata } from "next";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <Header
        theme="light"
        className="relative border-b border-gray-100 bg-white"
        mobileClassName="bg-white"
      />
      <div className="section-container max-w-3xl">
        <h1 className="font-clash-display text-3xl font-bold text-blue">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            This Privacy Policy explains how Prime Dial Solutions collects,
            uses, and protects your information when you use our website and
            services.
          </p>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              We collect information you provide directly, such as your
              name, email address, and password when you create an account,
              and order details when you make a purchase. If you sign in
              with Google, we receive your name, email, and profile image
              from your Google account.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              2. How We Use Your Information
            </h2>
            <p className="mt-2">
              We use your information to create and manage your account,
              process orders, provide customer support, and communicate
              updates about your orders or account.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              3. Password Storage
            </h2>
            <p className="mt-2">
              Passwords are never stored in plain text. We store a salted,
              one-way hash of your password and cannot retrieve your
              original password at any time.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              4. Data Sharing
            </h2>
            <p className="mt-2">
              We do not sell your personal information. We share data only
              with service providers necessary to operate our business
              (e.g. payment processing, hosting, and shipping), under
              appropriate confidentiality obligations.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              5. Your Rights
            </h2>
            <p className="mt-2">
              You can request access to, correction of, or deletion of your
              personal data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-clash-display text-lg font-semibold text-blue">
              6. Contact
            </h2>
            <p className="mt-2">
              Questions about this Privacy Policy can be sent through our{" "}
              <a href="/contact" className="text-blue-600 hover:text-blue-500">
                contact page
              </a>
              .
            </p>
          </section>

          <p className="pt-4 text-xs text-slate-400">
            This is placeholder content and has not been reviewed by legal
            counsel. Replace it with your finalized Privacy Policy before
            launch.
          </p>
        </div>
      </div>
    </>
  );
}
