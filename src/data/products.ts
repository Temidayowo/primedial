export interface SurveyingProduct {
  name: string;
  slug: string;
  brand: string; // matches Brand.slug below
  category: string; // matches Category.slug below
  description: string;
  price: number; // Use 0 if you want to display "Contact for Quote"
  images: string[];
  specSheetUrl?: string;
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
  { name: "Meridian", slug: "meridian" },
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
  {
    name: "Meridian M20L Laser GNSS RTK",
    slug: "meridian-m20l-laser-gnss-rtk",
    brand: "meridian",
    category: "gnss-receivers",
    description:
      "The Meridian M20L is a high-precision RTK system designed for professional surveying. It combines a 1408-channel multi-constellation receiver with 120° calibration-free IMU tilt compensation. Additionally, it features integrated green laser technology, enabling accurate rodless visual alignment up to 100 meters in challenging environments.",
    price: 0, // 0 triggers the "Contact for Quote" display as requested
    images: [
      "/images/products/meridian-m20l-main.jpg",
      "/images/products/meridian-m20l-laser.png",
      "/images/products/meridian-m20l-side.avif",
      "/docs/meridian-m20l-datasheet.pdf.jpg",
    ],
    specSheetUrl: "/docs/meridian-m20l-datasheet.pdf.jpg",
    features: [
      "1408-channel multi-constellation GNSS tracking (GPS, GLONASS, BeiDou, GALILEO, QZSS, IRNSS, L-Band)",
      "Integrated green laser technology for visual alignment up to 100 meters",
      "120° calibration-free IMU tilt sensor for flexible, rodless measurements",
      "High-capacity 7.4V 7000mAh lithium-ion battery providing up to 26 hours of operation",
      "Ultra-lightweight, palm-sized design weighing only 699g",
      "Rugged IP67-rated housing for extreme dust and water resistance",
      "Built-in GSM mode (45-50 km range) and 8 km radius range for local RTK communication",
    ],
    inStock: true,
    isFeatured: true,
  },
  {
    name: "Meridian MTS-A1",
    slug: "meridian-mts-a1",
    brand: "meridian",
    category: "total-stations",
    price: 0,
    inStock: true,
    description:
      "The MTS-A1 features a 6-inch HD touchscreen with Android OS and surveying software, equipped with a high-resolution camera to improve efficiency and accuracy. MTS-A1 offers high-quality, high-accuracy and stable performance.",
    images: [
      "/product-images/meridian-mts-a1/meridian-mts-a1-1.png",
      "/product-images/meridian-mts-a1/meridian-mts-a1-2.jpg",
    ],
    features: [
      "Android 11 Total Station with 6-inch HD touchscreen",
      "Angle accuracy: 1\" / 2\" (optional)",
      "Distance range: up to 4000m (single prism) / 1000m (non-prism)",
      "8MP AR stakeout camera",
      "Bluetooth 5.0 + WiFi",
      "IP65 dust/water resistant",
      "Weight: 7kg",
      "Dimensions: 217 × 198 × 378 mm",
    ],
    specSheetUrl:
      "https://cdn.xuansiwei.com/duola6779/upload/20260410/qstvnghg8h8/MTS-A1%20Android%20Total%20Station.pdf",
    isFeatured: true,
  },
  {
    name: "Meridian M5Plus",
    slug: "meridian-m5plus",
    brand: "meridian",
    category: "gnss-receivers",
    price: 0,
    inStock: true,
    description:
      "M5Plus GNSS receiver is an extremely lightweight, full-featured, intelligent GNSS receiver system equipped with an integrated full-frequency antenna and advanced multi-channel RTK engine, built-in radio, and 8GB internal storage — built for fast, reliable fixes in demanding field conditions.",
    images: ["/product-images/meridian-m5plus/meridian-m5plus-1.jpg"],
    features: [
      "Pocket-sized IMU-RTK GNSS receiver, 1408 channels",
      "RTK accuracy: ±(8mm+1ppm) horizontal / ±(15mm+1ppm) vertical",
      "Built-in UHF radio (1W/2W) + Bluetooth 5.2",
      "Up to 26h RTK rover / 30h static battery life",
      "IP68 dust/waterproof, 2m drop rated",
      "Weight: 599g",
      "Dimensions: 119 × 119 × 76 mm",
    ],
    specSheetUrl:
      "https://cdn.xuansiwei.com/duola6779/upload/20250919/uen4n53kfs8/Meridian%20M5Plus%20GNSS%20Receiver.pdf",
    isFeatured: true,
  },
  {
    name: "Meridian M5Plus + MBase RTK Kit",
    slug: "meridian-m5plus-mbase-kit",
    brand: "meridian",
    category: "gnss-receivers",
    inStock: true,
    description:
      "Complete base + rover RTK GNSS kit pairing the Meridian M5Plus rover with the Meridian MBase base station. The MBase's 5W internal radio extends reliable RTK coverage up to 35km under ideal conditions, while the M5Plus rover delivers all-day field battery life — a ready-to-survey pair out of the box.",
    images: [
      "/product-images/meridian-m5plus-mbase-kit/meridian-m5plus-1.jpg",
      "/product-images/meridian-m5plus-mbase-kit/meridian-mbase-1.jpg",
      "/product-images/meridian-m5plus-mbase-kit/meridian-mbase-2.jpg",
    ],
    features: [
      "Kit includes: 1x Meridian M5Plus rover + 1x Meridian MBase base station",
      "MBase: 5W radio, up to 35km RTK coverage (ideal conditions), 900g",
      "M5Plus: 599g, up to 26h RTK rover battery life",
      "RTK accuracy: ±(8mm+1ppm) horizontal / ±(15mm+1ppm) vertical (both units)",
      "Both units IP68 rated",
      // TODO: list whatever else physically ships in the kit (tribrach, poles,
      // controller, charger, case) — that's store-specific, not on the spec sheet.
    ],
    price: 0, // TODO: bundle price — usually rover + base list price minus a kit discount
    isFeatured: true,
  },
 
  // ---------- DJI (drones — verified specs, price is a placeholder) ----------
  {
    name: "DJI Matrice 400",
    slug: "dji-matrice-400",
    brand: "dji",
    category: "drones-uavs",
    price: 0,
    inStock: true,
    isFeatured: true,
    description:
      "DJI Matrice 400 is DJI's flagship heavy-lift enterprise drone, built for demanding mapping, inspection, and public-safety missions. It carries a 6kg payload across compatible Zenmuse gimbal cameras (L3, H30/H30T, L2, P1), runs up to 59 minutes per flight, and includes built-in RTK for survey-grade positioning.",
    images: ["/product-images/dji-matrice-400/dji-matrice400-1.jpg"],
    features: [
      "Max payload: 6kg (compatible with Zenmuse L3, H30, H30T, L2, P1)",
      "Takeoff weight: ~9.74kg (with batteries); max takeoff weight 15.8kg",
      "Up to 59 min max flight time (no payload)",
      "Up to 40km O4 Enterprise video transmission (FCC) / 20km (CE/SRRC/MIC)",
      "Built-in RTK: 1cm + 1ppm horizontal accuracy",
      "Omnidirectional obstacle sensing: binocular vision, rotating + upper LiDAR, 3D infrared, 6-direction mmWave radar",
      "IP55 rated",
    ],
    specSheetUrl: "https://enterprise.dji.com/matrice-400/specs",
  },
  {
    name: "DJI Air 2S",
    slug: "dji-air-2s",
    brand: "dji",
    category: "drones-uavs",
    price: 0,
    inStock: true,
    description:
      "DJI Air 2S pairs a 1-inch CMOS sensor with 5.4K video and intelligent shooting modes in a compact, foldable body — a strong all-round aerial photography drone.",
    images: [
      "/product-images/dji-air-2s/dji-air2s-1.png",
      "/product-images/dji-air-2s/dji-air2s-2.jpg",
      "/product-images/dji-air-2s/dji-air2s-3.jpg",
    ],
    features: [
      "1-inch CMOS sensor, 20MP stills",
      "5.4K/30fps video",
      "Takeoff weight: ~595g",
      "Up to 31 min max flight time",
      "12km O3 video transmission (FCC)",
      "4-directional obstacle sensing (front/back/up/down)",
      "MasterShots & intelligent shooting modes",
    ],
    specSheetUrl: "https://www.dji.com/air-2s/specs",
  },
  {
    name: "DJI Mavic 3",
    slug: "dji-mavic-3",
    brand: "dji",
    category: "drones-uavs",
    price: 0,
    inStock: true,
    description:
      "DJI Mavic 3 combines a Hasselblad main camera with a dedicated tele camera for hybrid zoom, backed by long flight time and omnidirectional obstacle sensing — built for professional aerial photography and mapping.",
    images: [
      "/product-images/dji-mavic-3/dji-mavic3-1.jpg",
      "/product-images/dji-mavic-3/dji-mavic3-2.jpg",
      "/product-images/dji-mavic-3/dji-mavic3-3.jpg",
    ],
    features: [
      "Dual camera: Hasselblad 4/3 CMOS 20MP main + 1/2\" 12MP tele (28x hybrid zoom)",
      "Takeoff weight: ~895g",
      "Up to 46 min max flight time",
      "15km O3+ video transmission (FCC)",
      "Omnidirectional obstacle sensing",
    ],
    specSheetUrl: "https://www.dji.com/mavic-3-pro/specs", // TODO: swap for the exact Mavic 3 SKU spec page/PDF you stock
  },
  {
    name: "DJI Mini 5 Pro",
    slug: "dji-mini-5-pro",
    brand: "dji",
    category: "drones-uavs",
    price: 0,
    inStock: true,
    description:
      "DJI Mini 5 Pro brings a 1-inch sensor and forward LiDAR obstacle sensing into a sub-250g airframe, so it stays under many local drone-registration weight thresholds while still delivering flagship-level capture quality.",
    images: [
      "/product-images/dji-mini-5-pro/dji-mini5pro-1.jpg",
      "/product-images/dji-mini-5-pro/dji-mini5pro-2.jpg",
      "/product-images/dji-mini-5-pro/dji-mini5pro-3.jpg",
    ],
    features: [
      "1-inch CMOS sensor, 50MP stills",
      "4K video up to 120fps, FHD up to 240fps",
      "Takeoff weight: 249.9g (±4g) — sub-250g category",
      "Up to 36 min flight time (52 min with Plus battery, where available)",
      "Up to 20km O4+ video transmission (FCC)",
      "Omnidirectional obstacle sensing incl. forward LiDAR",
    ],
  },
  {
    name: "DJI Matrice 4E",
    slug: "dji-matrice-4e",
    brand: "dji",
    category: "drones-uavs",
    price: 0,
    inStock: true,
    description:
      "DJI Matrice 4E is an enterprise mapping drone with a triple-camera payload and long endurance, built for aerial surveying and photogrammetry — a natural pairing with GNSS RTK base stations for ground-truthed mapping data.",
    images: ["/product-images/dji-matrice-4e/dji-matrice4e-1.jpg"],
    features: [
      "Triple camera: 4/3\" 20MP wide + 1/1.3\" 48MP medium tele + 1/1.5\" 48MP tele",
      "Takeoff weight: ~1219g (up to 1420g with accessories)",
      "Up to 49 min max flight time",
      "Up to 25km O4 video transmission (FCC) / 12km (CE)",
      "RTK-ready for survey-grade positioning",
      // Note: DJI also sells an M4T variant with an added thermal camera —
      // add it as a separate product if you stock that SKU too.
    ],
    specSheetUrl: "https://enterprise.dji.com/matrice-4-series/specs",
  },
];
