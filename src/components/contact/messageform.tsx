"use client";

import { useSearchParams } from "next/navigation";
import { FaPaperPlane } from "react-icons/fa6";
import { Button } from "../ui/button";
import { CONTACT_SUBJECTS } from "@/lib/inquiries";
import {
  FieldError,
  FormStatus,
  Honeypot,
  useInquiryForm,
} from "@/components/forms/inquiry-form-kit";

const inputClasses =
  "bg-gray-100 border-[0.1px] border-gray-300 outline-blue rounded px-3 py-1.5";
const labelClasses = "uppercase text-blue text-sm font-medium";

// Product pages link here for price-on-request items:
// /contact?subject=quote&product=<name>. Reading the URL needs a Suspense
// boundary on this prerendered page; the plain form is its fallback, so
// the form is always in the page HTML.
export function MessageFormFromUrl() {
  const searchParams = useSearchParams();
  return (
    <MessageForm
      subjectValue={searchParams.get("subject")}
      product={searchParams.get("product")?.slice(0, 200)}
    />
  );
}

const MessageForm = ({
  subjectValue,
  product,
}: {
  subjectValue?: string | null;
  product?: string;
}) => {
  const { state, errors, isPending, formRef, formAction, onSubmit } =
    useInquiryForm("CONTACT");

  const presetSubject = CONTACT_SUBJECTS.find((subject) => subject.value === subjectValue);

  return (
    <div
      id="contact-form"
      className="flex h-full scroll-mt-24 flex-col rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-5 py-8"
    >
      <h2 className="font-clash-display text-2xl font-semibold lg:text-3xl">Send us a message</h2>
      <p className="font-poppins text-sm mt-1 mb-4">
        Fill out the form and a member of our team will get back to you shortly.
      </p>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={onSubmit}
        className="relative flex h-full flex-col"
        noValidate
      >
        <Honeypot />
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className={labelClasses}>
              Full Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={inputClasses}
              placeholder="John Doe"
            />
            <FieldError messages={errors?.name} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className={labelClasses}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClasses}
              placeholder="john@example.com"
            />
            <FieldError messages={errors?.email} />
          </div>
        </div>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-phone" className={labelClasses}>
              Phone Number
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={inputClasses}
              placeholder="+234 800 000 0000"
            />
            <FieldError messages={errors?.phone} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-subject" className={labelClasses}>
              Subject
            </label>
            <select
              key={presetSubject?.value ?? "none"}
              id="contact-subject"
              name="subject"
              required
              defaultValue={presetSubject?.label ?? ""}
              className={`${inputClasses} py-2`}
            >
              <option value="" disabled>
                Choose a subject
              </option>
              {CONTACT_SUBJECTS.map((subject) => (
                <option key={subject.value} value={subject.label}>
                  {subject.label}
                </option>
              ))}
            </select>
            <FieldError messages={errors?.subject} />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <label htmlFor="contact-message" className={labelClasses}>
            Message
          </label>
          <textarea
            key={product ?? "none"}
            id="contact-message"
            name="message"
            required
            className="bg-gray-100 border-gray-300 border-[0.1px] outline-blue px-3 py-1.5 rounded resize-none"
            placeholder="How can we help?"
            defaultValue={
              product ? `I'd like a quote for the ${product}.\n\nQuantity: \nDelivery location: ` : ""
            }
            rows={4}
          ></textarea>
          <FieldError messages={errors?.message} />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-green rounded-4xl py-6 uppercase w-full mt-4 text-white text-base font-semibold flex items-center gap-3 cursor-pointer disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Send Message"}
          <FaPaperPlane className="text-base" />
        </Button>
        <FormStatus state={state} />
      </form>
    </div>
  );
};

export default MessageForm;
