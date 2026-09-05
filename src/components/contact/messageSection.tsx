import { FaLocationDot, FaPhone, FaEnvelope, FaClock } from "react-icons/fa6";
import MessageForm from "./messageform";

const MessageSection = () => {
  return (
    <section className="bg-gray-50">
      <div className="section-container grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
        <div className="self-center">
          <MessageForm />
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <div className="self-start rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-4 py-6 flex flex-col gap-2">
            <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-300 text-gray-700">
              <FaLocationDot className="size-5 text-blue" />
            </div>
            <h3 className="font-clash-display text-sm font-semibold">
              Address
            </h3>
            <p className="text-gray-600 text-sm">
              12, Akin Osiyemi Street, Allen Ikeja, Lagos State, Nigeria
            </p>
          </div>
          <div className="self-start rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-4 py-6 flex flex-col gap-2">
            <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-300 text-gray-700">
              <FaPhone className="size-5 text-blue" />
            </div>
            <h3 className="font-clash-display text-sm font-semibold">Phone</h3>
            <div className="flex flex-col">
              <a
                href="tel:+2348084729494"
                className="cursor-pointer hover:underline text-gray-600 text-sm"
              >
                +234 808 472 9494
              </a>
              <a
                href="tel:+2347068354374"
                className="cursor-pointer hover:underline text-gray-600 text-sm"
              >
                +234 706 835 4374
              </a>
            </div>
          </div>
          <div className="self-start rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-4 py-6 flex flex-col gap-2">
            <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-300 text-gray-700">
              <FaEnvelope className="size-5 text-blue" />
            </div>
            <h3 className="font-clash-display text-sm font-semibold">Email</h3>
            <div className="flex flex-col">
              <a
                href="mailto:info@primedialsolutions.com"
                className="cursor-pointer hover:underline text-gray-600 text-sm"
              >
                info@primedialsolutions.com
              </a>
            </div>
          </div>
          <div className="self-start rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-4 py-6 flex flex-col gap-2">
            <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-300 text-gray-700">
              <FaClock className="size-5 text-blue" />
            </div>
            <h3 className="font-clash-display text-sm font-semibold">
              Business Hours
            </h3>
            <p className="text-gray-600 text-sm">Mon-Fri, 8:00am-6:00pm</p>
          </div>
          <div className="col-span-2 max-h-64 overflow-hidden rounded-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4190.413420094946!2d3.3510445752416347!3d6.603769193390117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b923125f28875%3A0xeff45dbb34799958!2s12%20Akin%20Osiyemi%20St%2C%20Allen%2C%20Lagos%20101233%2C%20Lagos!5e1!3m2!1sen!2sng!4v1788620841043!5m2!1sen!2sng"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full rounded-xl border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;
