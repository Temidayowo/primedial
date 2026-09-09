import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/about-hero.jpg"
          alt="Surveyor at a construction site during sunset"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-blue/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue via-blue/20 to-blue/40" />

        <div className="relative flex h-full flex-col justify-between p-10">
          <Link
            href="/"
            className="font-clash-display text-lg font-bold text-white"
          >
            Prime Dial Solutions
          </Link>

          <div className="max-w-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
              <Compass className="size-5 text-white" />
            </div>
            <h2 className="font-clash-display text-2xl font-bold text-white">
              Precision equipment for professionals.
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Create an account to track orders, request bulk quotes, and
              unlock trade pricing for your survey crew.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <SignupForm />
      </div>
    </div>
  );
}
