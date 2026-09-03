export interface SurveyingProduct {
  name: string;
  slug: string;
  brand: string; // matches Brand.slug below
  category: string; // matches Category.slug below
  description: string;
  price: number; // Use 0 if you want to display "Contact for Quote"
  images: string[];
  features: string[];
  inStock: boolean;
  isFeatured?: boolean;
}

export interface ProductCategory {
  name: string;
  slug: string;
  icon?: string; // for "Shop by Category" cards
}

export interface ProductBrand {
  name: string;
  slug: string;
  logo?: string; // for brand logo display on product pages
}

export const productCategories: ProductCategory[] = [
  { name: "Total Stations", slug: "total-stations" },
  { name: "GNSS Receivers", slug: "gnss-receivers" },
  { name: "Laser Scanners", slug: "laser-scanners" },
  { name: "Drones & UAVs", slug: "drones-uavs" },
  { name: "Levels", slug: "levels" },
  { name: "Accessories", slug: "accessories" },
];

export const productBrands: ProductBrand[] = [
  { name: "Trimble", slug: "trimble" },
  { name: "Leica", slug: "leica" },
  { name: "DJI", slug: "dji" },
  { name: "FARO", slug: "faro" },
  { name: "Seco", slug: "seco" },
];

export const surveyingProducts: SurveyingProduct[] = [
  {
    name: "Trimble R12i GNSS System",
    slug: "trimble-r12i-gnss",
    brand: "trimble",
    category: "gnss-receivers",
    description:
      "A high-performance GNSS receiver featuring Trimble ProPoint RTK positioning engine and tilt compensation technology for unmatched accuracy in challenging environments.",
    price: 0,
    images: ["/product-images/Trimble-R12i-GNSS-System.jpg"],
    features: [
      "Trimble TIP tilt compensation",
      "ProPoint RTK engine",
      "672 channels with Trimble 360 satellite tracking",
      "Rugged IP67 rating",
    ],
    inStock: true,
    isFeatured: true,
  },
  {
    name: "Leica TS16 Robotic Total Station",
    slug: "leica-ts16-robotic-total-station",
    brand: "leica",
    category: "total-stations",
    description:
      "The world's first self-learning total station. Automatically adjusts to any environmental conditions, locking onto your target and ignoring other distractions in the field.",
    price: 0,
    images: ["/images/products/leica-ts16.jpg"],
    features: [
      "ATRplus target recognition",
      "Dynamic Lock technology",
      "AutoHeight feature",
      "Captivate field software integration",
    ],
    inStock: true,
    isFeatured: true,
  },
  {
    name: "Leica LS15 Digital Level",
    slug: "leica-ls15-digital-level",
    brand: "leica",
    category: "levels",
    description:
      "Experience extreme accuracy with the LS15 digital level. It minimizes human error in leveling processes with automated functions and an industry-leading 0.2mm accuracy.",
    price: 3500,
    images: ["/images/products/leica-ls15.jpg"],
    features: [
      "0.2mm accuracy",
      "Digital camera targeting",
      "Autofocus functionality",
      "Bluetooth and USB connectivity",
    ],
    inStock: true,
    isFeatured: true,
  },
  {
    name: "DJI Matrice 350 RTK",
    slug: "dji-matrice-350-rtk",
    brand: "dji",
    category: "drones-uavs",
    description:
      "An upgraded flagship drone platform featuring next-level video transmission, powerful flight performance, and comprehensive safety features for aerial surveying and photogrammetry.",
    price: 12500,
    images: ["/images/products/dji-matrice-350.jpg"],
    features: [
      "55-minute max flight time",
      "IP55 rating",
      "DJI O3 Enterprise Transmission",
      "Centimeter-level RTK positioning",
    ],
    inStock: false,
    isFeatured: true,
  },
  {
    name: "FARO Focus Premium 3D Laser Scanner",
    slug: "faro-focus-premium",
    brand: "faro",
    category: "laser-scanners",
    description:
      "Provides exceptional capturing efficiency, data quality, and accuracy for construction, public safety, and forensics applications.",
    price: 0,
    images: ["/images/products/faro-focus.jpg"],
    features: [
      "Up to 350m scanning range",
      "Smartphone-enabled remote control",
      "Hybrid Reality Capture",
      "50% faster scan times",
    ],
    inStock: true,
    isFeatured: true,
  },
  {
    name: "Heavy-Duty Wood Tripod with Dual Clamp",
    slug: "heavy-duty-wood-tripod",
    brand: "seco",
    category: "accessories",
    description:
      "A robust wooden tripod providing maximum stability for total stations and laser scanners, featuring dual clamps and a standard 5/8 x 11 mounting thread.",
    price: 185,
    images: ["/images/products/wood-tripod.jpg"],
    features: [
      "Vibration dampening hardwood",
      "Dual clamp locking mechanism",
      "Shoulder strap included",
      "Max height: 1.8m (71 inches)",
    ],
    inStock: true,
  },
  {
    name: "Carbon Fiber Prism Pole (2.5m)",
    slug: "carbon-fiber-prism-pole-2-5m",
    brand: "seco",
    category: "accessories",
    description:
      "Lightweight and durable carbon fiber telescopic prism pole, ideal for continuous field use with GNSS rovers and robotic total station targets.",
    price: 120,
    images: ["/images/products/carbon-pole.jpg"],
    features: [
      "Ultra-lightweight carbon fiber",
      "Twist-lock mechanism",
      "Built-in circular vial",
      "Graduated in cm and tenths",
    ],
    inStock: true,
  },
];