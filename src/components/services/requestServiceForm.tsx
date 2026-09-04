import { getCategories } from "@/lib/actions/products.action";
import { Button } from "@/components/ui/button";

const RequestServiceForm = async () => {
  const categories = await getCategories();

  return (
    <div className="border-[0.1px] border-gray-200 p-6 rounded-xl bg-gray-50">
      <form action="">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="full-name"
              className="uppercase text-blue text-sm font-medium"
            >
              Full Name
            </label>
            <input
              type="text"
              className="bg-gray-100 border-[0.1px] border-gray-300 ouliine-blue rounded px-3 py-1.5"
              placeholder="John Doe"
            />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="uppercase text-blue text-sm font-medium"
              >
                Email
              </label>
              <input
                type="email"
                className="bg-gray-100 border-[0.1px] border-gray-300 ouliine-blue rounded px-3 py-1.5"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mt-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="uppercase text-blue text-sm font-medium"
            >
              Phone Number
            </label>
            <input
              type="text"
              className="bg-gray-100 border-[0.1px] border-gray-300 ouliine-blue rounded px-3 py-1.5"
              placeholder="+234 800 000 0000"
            />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="company"
                className="uppercase text-blue text-sm font-medium"
              >
                Company Name
              </label>
              <input
                type="text"
                className="bg-gray-100 border-[0.1px] border-gray-300 ouliine-blue rounded px-3 py-1.5"
                placeholder="Company Ltd."
              />
            </div>
          </div>
        </div>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mt-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="equipment"
              className="uppercase text-blue text-sm font-medium"
            >
              Equipment Type
            </label>
            <select
              name="equipment"
              id="equipment-select"
              className="bg-gray-100 py-1.5 px-3 border-gray-300 outline-blue rounded"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="model"
                className="uppercase text-blue text-sm font-medium"
              >
                Email
              </label>
              <input
                type="model"
                className="bg-gray-100 border-[0.1px] border-gray-300 ouliine-blue rounded px-3 py-1.5"
                placeholder="e.g. Meridian SuperBase"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <label htmlFor="description">Issue Description</label>
          <textarea
            name="description"
            id="issue-description"
            className="bg-gray-100 border-gray-300 border-[0.1px] outline-blue px-3 py-1.5 rounded resize-none"
            placeholder="Describe the issue or calibration needed"
            rows={4}
          ></textarea>
        </div>
              <Button className="bg-green rounded-4xl py-6 uppercase w-full mt-4 text-white text-base font-semibold">Submit Request</Button>
      </form>
    </div>
  );
};

export default RequestServiceForm;
