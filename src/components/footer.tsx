import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import { SocialIcon } from "@/components/social-icon";
import { getPublishedSocialLinks } from "@/lib/content";
import { getContactDetails, telHref } from "@/lib/site-settings";
import { SOCIAL_PLATFORM_LABELS } from "@/lib/social-platforms";

const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const [socialLinks, contact] = await Promise.all([
    getPublishedSocialLinks(),
    getContactDetails(),
  ]);

  // Reusable Tailwind classes for the animated underline link
  const animatedLinkClasses = "relative inline-block pb-1 text-white transition-colors hover:text-gray-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-white after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full";

  return (
    <footer className="bg-blue border-t border-white/10 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <Link href="/">
              <Image 
                src="/images/logo/primedial-logo-2.png" 
                alt="Primedial Logo" 
                width={200} 
                height={60} 
                className="w-auto h-12" 
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs font-poppins">
              Delivering innovative geospatial solutions and high-quality services to help you navigate and map the world effectively.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-clash-display font-bold text-white text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm font-poppins">
              <li>
                <Link href="/" className={animatedLinkClasses}>Home</Link>
              </li>
              <li>
                <Link href="/about" className={animatedLinkClasses}>About Us</Link>
              </li>
              <li>
                <Link href="/shop" className={animatedLinkClasses}>Shop</Link>
              </li>
              <li>
                <Link href="/Services" className={animatedLinkClasses}>Services</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-clash-display font-bold text-white text-lg mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-sm font-poppins">
              <li>
                <Link href="/contact" className={animatedLinkClasses}>Contact Us</Link>
              </li>
              <li>
                <Link href="/track-order" className={animatedLinkClasses}>Track Your Order</Link>
              </li>
              <li>
                <Link href="/faq" className={animatedLinkClasses}>FAQs</Link>
              </li>
              <li>
                <Link href="/privacy" className={animatedLinkClasses}>Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className={animatedLinkClasses}>Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="font-clash-display font-bold text-white text-lg mb-4">
              Get in Touch
            </h3>
            {/* Edited at /admin/settings */}
            <ul className="space-y-3 text-sm text-gray-300 mb-6 font-poppins">
              <li className="flex items-start space-x-3">
                <FaLocationDot className="text-white mt-1 shrink-0" />
                <span>{contact.address}</span>
              </li>
              {contact.phones[0] && (
                <li className="flex items-center space-x-3">
                  <FaPhone className="text-white shrink-0" />
                  <a href={telHref(contact.phones[0])} className="hover:text-white">
                    {contact.phones[0]}
                  </a>
                </li>
              )}
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-white shrink-0" />
                <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
                  {contact.email}
                </a>
              </li>
            </ul>

            {/* Social Media Icons - managed in /admin/socials */}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_PLATFORM_LABELS[link.platform]}
                    className="text-gray-400 hover:text-white hover:-translate-y-1 transition-all duration-300"
                  >
                    <SocialIcon platform={link.platform} className="size-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
          
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t-[0.5px] border-white/20 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400 font-poppins">
            &copy; {currentYear} Primedial Geospatial Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;