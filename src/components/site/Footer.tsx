import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { site, navLinks } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-white/5 bg-onyx">
      <div className="container-luxe py-20 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <Link to="/" className="block">
            <span className="font-display text-3xl text-ivory">
              La Barberia
            </span>
            <span className="block eyebrow mt-2">
              Social Club · Galatsi
            </span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            {site.description}
          </p>
        </div>

        <div className="lg:col-span-3">
          <div className="eyebrow mb-6">Visit</div>
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
                {site.address.street}, {site.address.city}
                <br />
                {site.address.postalCode} {site.address.country}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone
                className="h-4 w-4 text-gold shrink-0"
                strokeWidth={1.4}
              />
              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="gold-underline"
              >
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
            <div className="flex items-center gap-3">
              <Instagram
                className="h-4 w-4 text-gold shrink-0"
                strokeWidth={1.4}
              />
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="gold-underline"
              >
                @labarberiasocialclub
              </a>
            </div>
          </address>
        </div>

        <div className="lg:col-span-2">
          <div className="eyebrow mb-6">Hours</div>
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
          <div className="eyebrow mb-6">Explore</div>
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
                Book
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-ivory/80 hover:text-gold transition-colors"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-ivory/80 hover:text-gold transition-colors"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-luxe py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {year} La Barberia Social Club. All rights reserved.
          </p>
          <p className="eyebrow text-[0.6rem]">Crafted in Athens</p>
        </div>
      </div>
    </footer>
  );
}
