import { Button } from "@/components/ui/button";

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

const ConsultationForm = () => {
  return (
    <form action="">
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="consultation-full-name"
            className="uppercase text-blue text-sm font-medium"
          >
            Full Name
          </label>
          <input
            id="consultation-full-name"
            type="text"
            name="fullName"
            className="bg-gray-100 border-[0.1px] border-gray-300 outline-blue rounded px-3 py-1.5"
            placeholder="John Doe"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="consultation-email"
            className="uppercase text-blue text-sm font-medium"
          >
            Email
          </label>
          <input
            id="consultation-email"
            type="email"
            name="email"
            className="bg-gray-100 border-[0.1px] border-gray-300 outline-blue rounded px-3 py-1.5"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mt-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="consultation-phone"
            className="uppercase text-blue text-sm font-medium"
          >
            Phone Number
          </label>
          <input
            id="consultation-phone"
            type="text"
            name="phone"
            className="bg-gray-100 border-[0.1px] border-gray-300 outline-blue rounded px-3 py-1.5"
            placeholder="+234 800 000 0000"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="consultation-company"
            className="uppercase text-blue text-sm font-medium"
          >
            Company Name
          </label>
          <input
            id="consultation-company"
            type="text"
            name="company"
            className="bg-gray-100 border-[0.1px] border-gray-300 outline-blue rounded px-3 py-1.5"
            placeholder="Company Ltd. (optional)"
          />
        </div>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mt-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="consultation-service"
            className="uppercase text-blue text-sm font-medium"
          >
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
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="consultation-location"
            className="uppercase text-blue text-sm font-medium"
          >
            Project Location
          </label>
          <input
            id="consultation-location"
            type="text"
            name="location"
            className="bg-gray-100 border-[0.1px] border-gray-300 outline-blue rounded px-3 py-1.5"
            placeholder="e.g. Lekki, Lagos"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label
          htmlFor="consultation-details"
          className="uppercase text-blue text-sm font-medium"
        >
          Project Details
        </label>
        <textarea
          name="details"
          id="consultation-details"
          className="bg-gray-100 border-gray-300 border-[0.1px] outline-blue px-3 py-1.5 rounded resize-none"
          placeholder="Tell us about the scope, size, and timeline of your project"
          rows={4}
        ></textarea>
      </div>

      <Button className="bg-green rounded-4xl py-6 uppercase w-full mt-4 text-white text-base font-semibold">
        Request Consultation
      </Button>
    </form>
  );
};

export default ConsultationForm;
