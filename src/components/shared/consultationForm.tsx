"use client";

import { Button } from "@/components/ui/button";
import {
  FieldError,
  FormStatus,
  Honeypot,
  useInquiryForm,
} from "@/components/forms/inquiry-form-kit";

const serviceOptions = [
  "Aerial Mapping & Drone Services",
  "Cadastral, GIS & Digital Mapping",
  "Topographical, As-built & Detail Surveys",
  "Engineering, Setting Out & Construction Surveys",
  "Hydrographic & Bathymetric Surveys",
  "Oil & Gas / Offshore Positioning Services",
  "Pipeline, Route & Mining Surveys",
  "Geophysical & Geotechnical Surveys",
  "Other",
];

const inputClasses =
  "bg-gray-100 border-[0.1px] border-gray-300 outline-blue rounded px-3 py-1.5";
const labelClasses = "uppercase text-blue text-sm font-medium";

const ConsultationForm = () => {
  const { state, errors, isPending, formRef, formAction, onSubmit } =
    useInquiryForm("CONSULTATION");

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      className="relative"
      noValidate
    >
      <Honeypot />
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="consultation-full-name" className={labelClasses}>
            Full Name
          </label>
          <input
            id="consultation-full-name"
            type="text"
            name="name"
            autoComplete="name"
            required
            className={inputClasses}
            placeholder="John Doe"
          />
          <FieldError messages={errors?.name} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="consultation-email" className={labelClasses}>
            Email
          </label>
          <input
            id="consultation-email"
            type="email"
            name="email"
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
          <label htmlFor="consultation-phone" className={labelClasses}>
            Phone Number
          </label>
          <input
            id="consultation-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            className={inputClasses}
            placeholder="+234 800 000 0000"
          />
          <FieldError messages={errors?.phone} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="consultation-company" className={labelClasses}>
            Company Name
          </label>
          <input
            id="consultation-company"
            type="text"
            name="company"
            autoComplete="organization"
            className={inputClasses}
            placeholder="Company Ltd. (optional)"
          />
          <FieldError messages={errors?.company} />
        </div>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="consultation-service" className={labelClasses}>
            Service Needed
          </label>
          <select
            id="consultation-service"
            name="service"
            className="bg-gray-100 py-1.5 px-3 border-gray-300 outline-blue rounded"
          >
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <FieldError messages={errors?.service} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="consultation-location" className={labelClasses}>
            Project Location
          </label>
          <input
            id="consultation-location"
            type="text"
            name="location"
            className={inputClasses}
            placeholder="e.g. Lekki, Lagos"
          />
          <FieldError messages={errors?.location} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="consultation-details" className={labelClasses}>
          Project Details
        </label>
        <textarea
          name="message"
          id="consultation-details"
          required
          className="bg-gray-100 border-gray-300 border-[0.1px] outline-blue px-3 py-1.5 rounded resize-none"
          placeholder="Tell us about the scope, size, and timeline of your project"
          rows={4}
        ></textarea>
        <FieldError messages={errors?.message} />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="bg-green rounded-4xl py-6 uppercase w-full mt-4 text-white text-base font-semibold disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Request Consultation"}
      </Button>
      <FormStatus state={state} />
    </form>
  );
};

export default ConsultationForm;
