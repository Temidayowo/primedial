"use client";

import { Button } from "@/components/ui/button";
import {
  FieldError,
  FormStatus,
  Honeypot,
  useInquiryForm,
} from "@/components/forms/inquiry-form-kit";

const inputClasses =
  "bg-gray-100 border-[0.1px] border-gray-300 outline-blue rounded px-3 py-2.5";
const labelClasses = "uppercase text-blue text-sm font-medium";

export function RequestServiceFormFields({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const { state, errors, isPending, formRef, formAction, onSubmit } =
    useInquiryForm("SERVICE_REQUEST");

  return (
    <div className="border-[0.1px] border-gray-200 p-6 md:p-8 rounded-xl bg-gray-50">
      <form
        ref={formRef}
        action={formAction}
        onSubmit={onSubmit}
        className="relative"
        noValidate
      >
        <Honeypot />
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col gap-2.5">
            <label htmlFor="service-name" className={labelClasses}>
              Full Name
            </label>
            <input
              id="service-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={inputClasses}
              placeholder="John Doe"
            />
            <FieldError messages={errors?.name} />
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="service-email" className={labelClasses}>
              Email
            </label>
            <input
              id="service-email"
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
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-6">
          <div className="flex flex-col gap-2.5">
            <label htmlFor="service-phone" className={labelClasses}>
              Phone Number
            </label>
            <input
              id="service-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={inputClasses}
              placeholder="+234 800 000 0000"
            />
            <FieldError messages={errors?.phone} />
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="service-company" className={labelClasses}>
              Company Name
            </label>
            <input
              id="service-company"
              name="company"
              type="text"
              autoComplete="organization"
              className={inputClasses}
              placeholder="Company Ltd."
            />
            <FieldError messages={errors?.company} />
          </div>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-6">
          <div className="flex flex-col gap-2.5">
            <label htmlFor="service-equipment" className={labelClasses}>
              Equipment Type
            </label>
            <select
              id="service-equipment"
              name="service"
              className="bg-gray-100 py-2.5 px-3 border-gray-300 outline-blue rounded"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            <FieldError messages={errors?.service} />
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="service-model" className={labelClasses}>
              Model
            </label>
            <input
              id="service-model"
              name="model"
              type="text"
              className={inputClasses}
              placeholder="e.g. Meridian SuperBase"
            />
            <FieldError messages={errors?.model} />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2.5">
          <label htmlFor="service-description" className={labelClasses}>
            Issue Description
          </label>
          <textarea
            id="service-description"
            name="message"
            required
            className="bg-gray-100 border-gray-300 border-[0.1px] outline-blue px-3 py-2.5 rounded resize-none"
            placeholder="Describe the issue or calibration needed"
            rows={4}
          ></textarea>
          <FieldError messages={errors?.message} />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-green rounded-4xl py-6 uppercase w-full mt-6 text-white text-base font-semibold disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Submit Request"}
        </Button>
        <FormStatus state={state} />
      </form>
    </div>
  );
}
