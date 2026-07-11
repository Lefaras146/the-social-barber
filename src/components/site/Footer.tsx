import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Mail, Facebook, Youtube } from "lucide-react";
import { site, navLinks } from "@/lib/site";

// TikTok icon (lucide has no official one)
function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M16.5 3v3.2a5.3 5.3 0 0 0 4.5 2.6v3.1a8.3 8.3 0 0 1-4.5-1.5v6.9a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.2a2.8 2.8 0 1 0 2 2.6V3h3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-white/5 bg-onyx">
      <div className="container-luxe py-20 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <Link to="/" className="block">
            <span className="font-display text-3xl text-ivory">
              La Barbería
            </span>
            <span className="block eyebrow mt-2">
              Social Club · Λαμπρινή
            </span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            {site.description}
          </p>
          <div className="flex items-center gap-5 pt-2">
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-ivory/70 hover:text-gold transition-colors"
            >
              <Instagram className="h-5 w-5" strokeWidth={1.4} />
            </a>
            <a
              href={site.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="text-ivory/70 hover:text-gold transition-colors"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-ivory/70 hover:text-gold transition-colors"
            >
              <Facebook className="h-5 w-5" strokeWidth={1.4} />
            </a>
            <a
              href={site.socials.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="text-ivory/70 hover:text-gold transition-colors"
            >
              <Youtube className="h-5 w-5" strokeWidth={1.4} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="eyebrow mb-6">Επικοινωνία</div>
          <address className="not-italic space-y-3 text-sm text-ivory/80">
            <div className="flex items-start gap-3">
              <MapPin
                className="h-4 w-4 mt-0.5 text-gold shrink-0"
                strokeWidth={1.4}
              />
              <a
                href={site.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="gold-underline hover:text-ivory"
              >
                {site.address.street}, {site.address.area}
                <br />
                {site.address.postalCode} {site.address.city}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone
                className="h-4 w-4 text-gold shrink-0"
                strokeWidth={1.4}
              />
              <a href={site.phoneHref} className="gold-underline">
                {site.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail
                className="h-4 w-4 text-gold shrink-0"
                strokeWidth={1.4}
              />
              <a href={`mailto:${site.email}`} className="gold-underline">
                {site.email}
              </a>
            </div>
          </address>
        </div>

        <div className="lg:col-span-2">
          <div className="eyebrow mb-6">Ώρες</div>
          <ul className="space-y-2 text-sm text-ivory/80">
            {site.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span className="text-muted-foreground">{h.day}</span>
                <span>{h.hours}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="eyebrow mb-6">Πλοήγηση</div>
          <ul className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-ivory/80 hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/book"
                className="text-ivory/80 hover:text-gold transition-colors"
              >
                Ραντεβού
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-ivory/80 hover:text-gold transition-colors"
              >
                Απόρρητο
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-ivory/80 hover:text-gold transition-colors"
              >
                Όροι
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-luxe py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {year} La Barbería Social Club. Με επιφύλαξη κάθε
            δικαιώματος.
          </p>
          <p className="eyebrow text-[0.6rem]">Made in Athens</p>
        </div>
      </div>
    </footer>
  );
}
