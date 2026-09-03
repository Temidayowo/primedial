import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const clashDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    }
  ],
  display: "swap",
  variable: "--font-clash-display",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Primedial Solutions",
    template: "%s | Primedial Solutions",
  },
  description:
    "Prime Dial Solutions offers expert land surveying services and high-precision surveying equipment for professionals in construction, GIS, and engineering",
  keywords: [
    "Primedial Solutions",
    "Land Surveying",
    "Geospatial Services",
    "Topographic Survey",
    "Mapping Solutions",
    "Surveying Equipment",
    "Professional Surveyors in Nigeria"
  ],
  openGraph: {
    title: "Primedial Solutions",
    description:
      "Prime Dial Solutions offers expert land surveying services and high-precision surveying equipment for professionals in construction, GIS, and engineering",
    url: "https://primedialsolutions.com",
    siteName: "Primedial Solutions",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} font-poppins ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
