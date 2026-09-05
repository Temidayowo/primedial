import { FaPaperPlane } from "react-icons/fa6";
import { Button } from "../ui/button";

const MessageForm = () => {
  return (
    <div className="flex h-full flex-col rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-5 py-8">
      <h2 className="font-clash-display text-2xl font-semibold lg:text-3xl">Send us a message</h2>
      <p className="font-poppins text-sm mt-1 mb-4">
        Fill out the form and a member of our team will get back to you shortly.
      </p>
      <form action="" className="flex h-full flex-col">
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
              type="number"
              className="bg-gray-100 border-[0.1px] border-gray-300 ouliine-blue rounded px-3 py-1.5 no-spinner"
              placeholder="+234 800 000 0000"
            />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="subject"
                className="uppercase text-blue text-sm font-medium"
              >
                Subject
              </label>
              <input
                type="text"
                className="bg-gray-100 border-[0.1px] border-gray-300 ouliine-blue rounded px-3 py-1.5"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            className="bg-gray-100 border-gray-300 border-[0.1px] outline-blue px-3 py-1.5 rounded resize-none"
            placeholder="Describe the issue or calibration needed"
            rows={4}
          ></textarea>
        </div>
        <Button className="bg-green rounded-4xl py-6 uppercase w-full mt-4 text-white text-base font-semibold flex  items-center gap-3 cursor-pointer">
          Submit Request
          <FaPaperPlane className="text-base" />
        </Button>
      </form>
    </div>
  );
};

export default MessageForm;
