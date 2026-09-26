import { prisma } from "../src/lib/prisma";

// Starting content for the CMS sections managed under /admin: the
// projects and testimonials that were hardcoded in the page components
// before those sections moved to the database.
//
// Team members, partners and social links are deliberately not seeded -
// the hardcoded versions were placeholders ("John Doe", logoipsum logos,
// "#" links), and those sections stay hidden until real entries exist.
//
// Each table is only filled while it's empty, so this is safe to re-run
// and never touches content an admin has already added or edited.
//
//   npm run db:seed:content      (also runs as part of npm run db:seed)

const projects = [
  {
    title: "GREENWICH GARDENS PHASE I & II",
    summary:
      "Construction & Engineering - Real Estate Layout, Setting Out, Piling, Layout, Topographical Survey",
    location: "KOSOFE, Lagos",
    image: "/images/shop-section.jpg",
    isExample: false,
    sortOrder: 1,
  },
  {
    title: "OFFSHORE PLATFORM POSITIONING SURVEY",
    summary: "Oil & Gas - Offshore Positioning & Marine Construction Support",
    location: "BONNY, Rivers State",
    image: "/images/shop-section.jpg",
    isExample: true,
    sortOrder: 2,
  },
  {
    title: "ESTATE LAND DOCUMENTATION & TITLING",
    summary: "Cadastral - Land Documentation, Charting & Layout Survey",
    location: "EPE, Lagos",
    image: "/images/shop-section.jpg",
    isExample: true,
    sortOrder: 3,
  },
];

const testimonials = [
  {
    name: "Oluwaseun Adebayo",
    role: "Chief Surveyor, Meridian Geo-Systems",
    content:
      "The Trimble R12i we procured has completely transformed our workflow. The accuracy in challenging canopy environments is unmatched, and the customer support was exceptional.",
    rating: 5,
    sortOrder: 1,
  },
  {
    name: "Emeka Nnamdi",
    role: "Project Manager, CT EDGE Construction",
    content:
      "Fast delivery and highly reliable equipment. We have been sourcing our Leica Total Stations here for over two years, and the calibration is always spot-on right out of the box.",
    rating: 5,
    sortOrder: 2,
  },
  {
    name: "Aisha Bello",
    role: "GIS Specialist, BHL Real Estate",
    content:
      "Excellent service! They helped us transition to newer RTK GPS systems effortlessly. Their technical advice saved us both time and money on our latest mapping project.",
    rating: 5,
    sortOrder: 3,
  },
];

export async function seedContent() {
  if ((await prisma.project.count()) === 0) {
    console.log("Seeding projects...");
    await prisma.project.createMany({ data: projects });
  } else {
    console.log("Projects already exist - skipping.");
  }

  if ((await prisma.testimonial.count()) === 0) {
    console.log("Seeding testimonials...");
    await prisma.testimonial.createMany({ data: testimonials });
  } else {
    console.log("Testimonials already exist - skipping.");
  }
}

// Run directly via `npm run db:seed:content` (which passes --run);
// imported by seed.ts otherwise.
if (process.argv.includes("--run")) {
  seedContent()
    .then(() => console.log("Content seeding complete."))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
