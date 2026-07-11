import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

export const site = {
  name: "La Barberia Social Club",
  shortName: "La Barberia",
  tagline: "The gentleman's ritual, reimagined.",
  description:
    "A private, members-styled barbershop in Galatsi, Athens — pairing traditional grooming with a distinctly modern hospitality.",
  address: {
    street: "Veikou 92",
    city: "Galatsi",
    region: "Athens",
    postalCode: "111 46",
    country: "Greece",
  },
  phone: "+30 210 000 0000",
  email: "hello@labarberiasocialclub.gr",
  instagram: "https://instagram.com/labarberiasocialclub",
  mapsEmbed:
    "https://www.google.com/maps?q=Galatsi%2C%20Athens%2C%20Greece&output=embed",
  mapsLink: "https://maps.google.com/?q=Galatsi,Athens,Greece",
  hours: [
    { day: "Monday", hours: "Closed" },
    { day: "Tuesday – Friday", hours: "10:00 — 21:00" },
    { day: "Saturday", hours: "09:00 — 19:00" },
    { day: "Sunday", hours: "By appointment" },
  ],
  images: { hero, about, team1, team2, team3, g1, g2, g3, g4 },
} as const;

export type Service = {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
};

export const services: Service[] = [
  {
    id: "signature-cut",
    name: "Signature Cut",
    duration: "45 min",
    price: "€28",
    description:
      "A precise haircut consultation, scissor and clipper work, tailored to your face and lifestyle. Finished with a hot towel and styling.",
  },
  {
    id: "beard-sculpt",
    name: "Beard Sculpt",
    duration: "30 min",
    price: "€18",
    description:
      "Line-up, contour and beard care ritual. Warm oils, hot towel, and a straight-razor finish for edges only a master hand can deliver.",
  },
  {
    id: "the-social-ritual",
    name: "The Social Ritual",
    duration: "1h 30min",
    price: "€60",
    description:
      "Our signature experience: cut, straight-razor shave, deep scalp treatment, hot towel, and a glass of whisky. Time made for you.",
  },
  {
    id: "straight-razor-shave",
    name: "Straight Razor Shave",
    duration: "40 min",
    price: "€22",
    description:
      "The old-world shave — hot towels, hand-lathered soap, and a hand-honed straight blade. Skin left calm and quietly renewed.",
  },
  {
    id: "father-and-son",
    name: "Father & Son",
    duration: "1h",
    price: "€40",
    description:
      "Two chairs, two generations. A shared ritual for the men in your family — including a small keepsake for the little one.",
  },
  {
    id: "grooming-membership",
    name: "Membership",
    duration: "Monthly",
    price: "from €80",
    description:
      "Priority booking, unlimited cuts, complimentary beard maintenance and 15% off products. For the regulars we consider family.",
  },
];

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  years: number;
};

export const team: TeamMember[] = [
  {
    id: "alexandros",
    name: "Alexandros Papadakis",
    role: "Founder · Master Barber",
    bio: "Trained in Milan and London, Alexandros returned to Athens to build the shop he always wished existed — quiet, exact, and generous.",
    image: team1,
    years: 14,
  },
  {
    id: "nikos",
    name: "Nikos Vlahos",
    role: "Senior Barber",
    bio: "Known for architectural fades and a steady straight-razor hand. Nikos treats every appointment as its own composition.",
    image: team2,
    years: 9,
  },
  {
    id: "dimitris",
    name: "Dimitris Kariotis",
    role: "Beard Specialist",
    bio: "A decade shaping beards from Athens to Berlin. Dimitris believes a beard should look inevitable — never worked on.",
    image: team3,
    years: 11,
  },
];

export const gallery = [
  { src: g1, alt: "Straight razor shave in progress" },
  { src: g2, alt: "Client after signature cut" },
  { src: g3, alt: "Vintage barber chair under warm light" },
  { src: g4, alt: "Apothecary shelf of grooming products" },
  { src: about, alt: "Vintage barber tools on walnut" },
  { src: hero, alt: "La Barberia Social Club interior" },
];

export type Review = {
  id: string;
  name: string;
  rating: number;
  quote: string;
  meta: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Yannis M.",
    rating: 5,
    quote:
      "The most considered barbershop in Athens. Every detail — from the espresso to the finishing tonic — is deliberate.",
    meta: "Google Review",
  },
  {
    id: "r2",
    name: "Stavros K.",
    rating: 5,
    quote:
      "I fly in from Thessaloniki for my cut. That should tell you everything. Alexandros is a craftsman.",
    meta: "Google Review",
  },
  {
    id: "r3",
    name: "Michalis P.",
    rating: 5,
    quote:
      "Understated luxury done right. No music blaring, no rush — just precise work and a quiet room.",
    meta: "Google Review",
  },
  {
    id: "r4",
    name: "Andreas L.",
    rating: 5,
    quote:
      "The Social Ritual is worth every euro. Left with the best shave and cut of my life.",
    meta: "Google Review",
  },
  {
    id: "r5",
    name: "Kostas V.",
    rating: 5,
    quote:
      "Interiors like a Milanese bar, service like a Savile Row tailor. This is the new standard.",
    meta: "Google Review",
  },
  {
    id: "r6",
    name: "Petros D.",
    rating: 5,
    quote:
      "Brought my father here for his birthday. He hasn't stopped talking about it since.",
    meta: "Google Review",
  },
];

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/team", label: "Team" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;
