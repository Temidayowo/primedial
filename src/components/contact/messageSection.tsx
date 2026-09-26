import { FaLocationDot, FaPhone, FaEnvelope, FaClock } from "react-icons/fa6";
import { Suspense } from "react";
import MessageForm, { MessageFormFromUrl } from "./messageform";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
  slideRight,
} from "@/components/ui/MotionWrapper";
import { contactMapEmbedUrl, getContactDetails, telHref } from "@/lib/site-settings";

// Contact details are edited at /admin/settings.
const MessageSection = async () => {
  const contact = await getContactDetails();

  return (
    <section className="bg-gray-50 overflow-hidden">
      <div className="section-container grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
        <AnimateOnScroll variants={slideRight} className="self-center">
          <Suspense fallback={<MessageForm />}>
            <MessageFormFromUrl />
          </Suspense>
        </AnimateOnScroll>
        <StaggerContainer className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <StaggerItem>
            <div className="self-start rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-4 py-6 flex flex-col gap-2">
              <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-green/10">
                <FaLocationDot className="size-5 text-green" />
              </div>
              <h3 className="font-clash-display text-sm font-semibold">
                Address
              </h3>
              <p className="text-gray-600 text-sm">{contact.address}</p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="self-start rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-4 py-6 flex flex-col gap-2">
              <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-green/10">
                <FaPhone className="size-5 text-green" />
              </div>
              <h3 className="font-clash-display text-sm font-semibold">Phone</h3>
              <div className="flex flex-col">
                {contact.phones.map((phone) => (
                  <a
                    key={phone}
                    href={telHref(phone)}
                    className="cursor-pointer hover:underline text-gray-600 text-sm"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="self-start rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-4 py-6 flex flex-col gap-2">
              <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-green/10">
                <FaEnvelope className="size-5 text-green" />
              </div>
              <h3 className="font-clash-display text-sm font-semibold">Email</h3>
              <div className="flex flex-col">
                <a
                  href={`mailto:${contact.email}`}
                  className="cursor-pointer hover:underline text-gray-600 text-sm break-all"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="self-start rounded-xl border-[0.1px] border-gray-300 bg-gray-100 px-4 py-6 flex flex-col gap-2">
              <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-green/10">
                <FaClock className="size-5 text-green" />
              </div>
              <h3 className="font-clash-display text-sm font-semibold">
                Business Hours
              </h3>
              <p className="text-gray-600 text-sm">{contact.businessHours}</p>
            </div>
          </StaggerItem>
          <StaggerItem className="col-span-2">
            <div className="max-h-64 overflow-hidden rounded-xl">
              <iframe
                title={`Map of ${contact.address}`}
                src={contactMapEmbedUrl(contact)}
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full rounded-xl border-0"
              ></iframe>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default MessageSection;
