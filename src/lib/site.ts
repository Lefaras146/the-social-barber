import hero from "@/assets/real/hero.jpg";
import about1 from "@/assets/real/about-1.jpg";
import about2 from "@/assets/real/about-2.jpg";
import efraim from "@/assets/real/efraim.jpg";
import camilo from "@/assets/real/camilo.png";
import g1 from "@/assets/real/gallery-1.jpg";
import g2 from "@/assets/real/gallery-2.jpg";

export const site = {
  name: "La Barbería Social Club",
  shortName: "La Barbería",
  tagline: "Το κουρείο, όπως πρέπει να είναι.",
  description:
    "Χώρος ανδρικής περιποίησης στη Λαμπρινή, εμπνευσμένος από την old school φιλοσοφία του παραδοσιακού κουρείου, προσαρμοσμένος στη σύγχρονη εποχή.",
  address: {
    street: "Ι. Φωκά 90",
    area: "Λαμπρινή",
    city: "Αθήνα",
    postalCode: "11146",
    country: "Ελλάδα",
  },
  phone: "210 2222444",
  phoneHref: "tel:+302102222444",
  email: "info@labarberiasocialclub.gr",
  socials: {
    instagram:
      "https://www.instagram.com/labarberiasocialclub.gr?igsh=OGZyamU1MjVlbTZk",
    tiktok:
      "https://www.tiktok.com/@labarberiasocialclub.gr",
    facebook:
      "https://www.facebook.com/share/14S73iHe4FT/?mibextid=wwXIfr",
    youtube:
      "https://youtube.com/@labarberiasocialclub?si=a9JjfmmJkA5rYuuI",
  },
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=La+Barberia+Social+Club+%CE%9B%CE%B1%CE%BC%CF%80%CF%81%CE%B9%CE%BD%CE%AE",
  mapsEmbed:
    "https://www.google.com/maps?q=%CE%99.%20%CE%A6%CF%89%CE%BA%CE%AC%2090%2C%20%CE%9B%CE%B1%CE%BC%CF%80%CF%81%CE%B9%CE%BD%CE%AE%2C%20%CE%91%CE%B8%CE%AE%CE%BD%CE%B1&output=embed",
  mapsLink:
    "https://maps.google.com/?q=%CE%99.+%CE%A6%CF%89%CE%BA%CE%AC+90,+%CE%9B%CE%B1%CE%BC%CF%80%CF%81%CE%B9%CE%BD%CE%AE,+%CE%91%CE%B8%CE%AE%CE%BD%CE%B1",
  hours: [
    { day: "Δευτέρα", hours: "Κλειστά" },
    { day: "Τρίτη", hours: "09:00 — 21:00" },
    { day: "Τετάρτη", hours: "09:00 — 15:00" },
    { day: "Πέμπτη", hours: "09:00 — 21:00" },
    { day: "Παρασκευή", hours: "09:00 — 21:00" },
    { day: "Σάββατο", hours: "09:00 — 15:00" },
    { day: "Κυριακή", hours: "Κλειστά" },
  ],
  images: { hero, about1, about2, efraim, camilo, g1, g2 },
} as const;

export type ServiceCategory = "Κουρέματα" | "Γένια & Ξύρισμα" | "Περιποίηση";

export type Service = {
  id: string;
  name: string;
  price: string;
  category: ServiceCategory;
};

export const services: Service[] = [
  { id: "classic", name: "Κούρεμα Classic", price: "14€", category: "Κουρέματα" },
  { id: "fade", name: "Κούρεμα Fade", price: "14€", category: "Κουρέματα" },
  { id: "cut-wash", name: "Κούρεμα & Λούσιμο", price: "16€", category: "Κουρέματα" },
  { id: "kids", name: "Παιδικό Κούρεμα", price: "11€", category: "Κουρέματα" },

  { id: "beard-machine", name: "Γενειάδα με μηχανή", price: "5€", category: "Γένια & Ξύρισμα" },
  { id: "beard-scissor", name: "Γενειάδα με ψαλίδι", price: "7€", category: "Γένια & Ξύρισμα" },
  { id: "exclusive-beard", name: "Exclusive Γένια", price: "12€", category: "Γένια & Ξύρισμα" },
  { id: "shave", name: "Ξύρισμα", price: "9€", category: "Γένια & Ξύρισμα" },
  { id: "shave-hot", name: "Ξύρισμα με κομπρέσες", price: "12€", category: "Γένια & Ξύρισμα" },

  { id: "threading", name: "Αποτρίχωση με κλωστή", price: "5€", category: "Περιποίηση" },
  { id: "facial", name: "Καθαρισμός προσώπου", price: "14€", category: "Περιποίηση" },
  { id: "wash", name: "Λούσιμο", price: "5€", category: "Περιποίηση" },
];

export const serviceCategories: ServiceCategory[] = [
  "Κουρέματα",
  "Γένια & Ξύρισμα",
  "Περιποίηση",
];

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const team: TeamMember[] = [
  {
    id: "efraim",
    name: "Εφραίμ",
    role: "Barber · 13 χρόνια εμπειρίας",
    image: efraim,
    bio: "Δουλεύω με έμφαση στην ποιότητα, την καθαριότητα και την προσοχή στη λεπτομέρεια. Ακούω τον πελάτη και προσαρμόζομαι στο στυλ του — για μένα το καλό κούρεμα σημαίνει και εμπιστοσύνη. Εκτός δουλειάς, έχω πάθος με τα μηχανοκίνητα χόμπι, μια ενέργεια που φέρνω σε κάθε υπηρεσία.",
  },
  {
    id: "camilo",
    name: "Καμίλο",
    role: "Guest Barber",
    image: camilo,
    bio: "Με εκπαίδευση στη σχολή Antonio Eloy στην Ισπανία και εμπειρία σε barbershops σε Ελλάδα, Ισπανία και Άμστερνταμ, έχω αναπτύξει ένα στυλ που συνδυάζει διεθνή αισθητική με ακρίβεια και χαρακτήρα. Για μένα τα πράγματα είναι απλά: μουσική — κυρίως rock και blues — η μυρωδιά της βενζίνης, και να κάνω αυτό που αγαπώ.",
  },
];

export const gallery = [
  { src: hero, alt: "Ο χώρος του La Barbería Social Club" },
  { src: g1, alt: "Στιγμιότυπο μέσα στο κουρείο" },
  { src: g2, alt: "Στιγμιότυπο μέσα στο κουρείο" },
  { src: about1, alt: "Λεπτομέρεια από το La Barbería" },
  { src: about2, alt: "Λεπτομέρεια από το La Barbería" },
];

export const navLinks = [
  { to: "/", label: "Αρχική" },
  { to: "/about", label: "Το κουρείο" },
  { to: "/services", label: "Υπηρεσίες" },
  { to: "/team", label: "Η ομάδα" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Κριτικές" },
  { to: "/contact", label: "Επικοινωνία" },
] as const;
