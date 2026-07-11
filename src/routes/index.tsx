import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { site, services, team } from "@/lib/site";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LuxeLink, LuxeAnchor } from "@/components/site/LuxeButton";
import { ServiceRow } from "@/components/site/ServiceRow";
import { TeamCard } from "@/components/site/TeamCard";
import { Instagram, ArrowUpRight, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <IntroStrip />
      <ServicesPreview />
      <TeamPreview />
      <GalleryPreview />
      <ReviewsCTA />
      <InstagramCTA />
      <VisitSection />
    </>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <motion.img
        src={site.images.hero}
        alt="La Barbería Social Club"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: reduce ? 1 : 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/40 to-onyx" />
      <div className="absolute inset-0 bg-gradient-to-r from-onyx/70 via-transparent to-transparent" />

      <div className="relative container-luxe min-h-[100svh] flex flex-col justify-end pb-24 md:pb-32 pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-8 text-gold"
        >
          Λαμπρινή · Αθήνα · Est. La Barbería
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-display text-[3rem] sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.95] text-ivory max-w-5xl"
        >
          Το κουρείο,
          <br />
          όπως <span className="italic text-gold">πρέπει</span> να είναι.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 max-w-xl text-lg text-ivory/80 leading-relaxed"
        >
          Χώρος ανδρικής περιποίησης εμπνευσμένος από την old school
          φιλοσοφία του παραδοσιακού κουρείου, προσαρμοσμένος στη σύγχρονη
          εποχή.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <LuxeLink to="/book">Κλείσε ραντεβού</LuxeLink>
          <LuxeLink to="/services" variant="outline">
            Οι υπηρεσίες μας
          </LuxeLink>
        </motion.div>
      </div>
    </section>
  );
}

function IntroStrip() {
  return (
    <section className="container-luxe py-32 md:py-48">
      <div className="grid gap-12 lg:grid-cols-12 items-end">
        <Reveal className="lg:col-span-2 eyebrow">Η φιλοσοφία μας</Reveal>
        <Reveal delay={0.05} className="lg:col-span-9">
          <p className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-ivory">
            Το La Barbería Social Club δεν είναι απλώς ένα κουρείο. Είναι
            ένας χώρος για να μοιράζεσαι στιγμές, να φροντίζεις την εικόνα
            σου και να επιστρέφεις στα <span className="italic text-gold">βασικά</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesPreview() {
  const preview = services.filter((s) =>
    ["classic", "fade", "exclusive-beard", "shave-hot"].includes(s.id),
  );
  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="grid lg:grid-cols-12 gap-16 mb-12">
        <div className="lg:col-span-6">
          <SectionHeading
            eyebrow="Υπηρεσίες"
            title={
              <>
                Παραδοσιακό <span className="italic text-gold">grooming</span>, με ακρίβεια.
              </>
            }
          />
        </div>
        <div className="lg:col-span-5 lg:col-start-8 self-end">
          <Reveal delay={0.1}>
            <p className="text-muted-foreground leading-relaxed">
              Κουρέματα, γένια, ξύρισμα και περιποίηση. Κάθε υπηρεσία
              προσφέρεται με ηρεμία και σεβασμό στο προσωπικό στυλ και
              τις ανάγκες του κάθε πελάτη.
            </p>
          </Reveal>
        </div>
      </div>
      <Stagger stagger={0.08}>
        <div>
          {preview.map((s) => (
            <ServiceRow key={s.id} service={s} />
          ))}
          <div className="border-t border-white/8" />
        </div>
      </Stagger>
      <Reveal className="mt-12">
        <LuxeLink to="/services" variant="outline">
          Όλες οι υπηρεσίες
        </LuxeLink>
      </Reveal>
    </section>
  );
}

function TeamPreview() {
  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="mb-16">
        <SectionHeading
          eyebrow="Η ομάδα μας"
          title={
            <>
              Έμπειροι επαγγελματίες. <br />
              <span className="italic text-gold">Ένα standard.</span>
            </>
          }
          description="Η ομάδα του La Barbería Social Club δίνει έμφαση στην τεχνική, τη λεπτομέρεια και το αυθεντικό grooming — πάντα με σεβασμό στο προσωπικό στυλ."
        />
      </div>
      <Stagger>
        <div className="grid gap-10 md:grid-cols-2 max-w-4xl">
          {team.map((m) => (
            <TeamCard key={m.id} member={m} />
          ))}
        </div>
      </Stagger>
      <Reveal className="mt-16">
        <LuxeLink to="/team" variant="outline">
          Γνώρισε την ομάδα
        </LuxeLink>
      </Reveal>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-luxe mb-16">
        <SectionHeading
          eyebrow="Ο χώρος"
          title={
            <>
              Μια ματιά μέσα <span className="italic text-gold">στο κουρείο</span>.
            </>
          }
        />
      </div>
      <Stagger stagger={0.1}>
        <div className="container-luxe grid gap-4 md:gap-6 md:grid-cols-6">
          <StaggerItem className="md:col-span-4">
            <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-charcoal">
              <img
                src={site.images.g1}
                alt="Στιγμιότυπο από το La Barbería"
                loading="lazy"
                className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
              />
            </div>
          </StaggerItem>
          <StaggerItem className="md:col-span-2">
            <div className="overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto md:h-full bg-charcoal">
              <img
                src={site.images.about1}
                alt="Λεπτομέρεια από το La Barbería"
                loading="lazy"
                className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
              />
            </div>
          </StaggerItem>
        </div>
      </Stagger>
      <div className="container-luxe mt-14">
        <Reveal>
          <LuxeLink to="/gallery" variant="outline">
            Δες το gallery
          </LuxeLink>
        </Reveal>
      </div>
    </section>
  );
}

function ReviewsCTA() {
  return (
    <section className="container-luxe py-24 md:py-32">
      <Reveal>
        <a
          href={site.googleReviewsUrl}
          target="_blank"
          rel="noreferrer"
          className="group block card-elegant p-12 md:p-20 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="eyebrow mb-4 text-gold">Κριτικές</div>
              <div className="flex items-center gap-1 text-gold mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold" strokeWidth={0} />
                ))}
              </div>
              <h3 className="font-display text-4xl md:text-6xl text-ivory leading-tight">
                Διαβάστε τι <span className="italic">λένε</span>
                <br />
                για μας οι πελάτες μας.
              </h3>
              <p className="mt-6 text-muted-foreground max-w-md">
                Δείτε τις κριτικές του La Barbería Social Club στην
                Google.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ArrowUpRight
                className="h-10 w-10 text-ivory group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"
                strokeWidth={1.3}
              />
            </div>
          </div>
        </a>
      </Reveal>
    </section>
  );
}

function InstagramCTA() {
  return (
    <section className="container-luxe py-16">
      <Reveal>
        <a
          href={site.socials.instagram}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between gap-6 py-8 border-t border-b border-white/8 hover:border-gold/40 transition-colors duration-500"
        >
          <div>
            <div className="eyebrow mb-3 text-gold">Instagram</div>
            <h3 className="font-display text-3xl md:text-4xl text-ivory">
              @labarberiasocialclub.gr
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <Instagram
              className="h-8 w-8 text-ivory group-hover:text-gold transition-colors duration-500"
              strokeWidth={1.3}
            />
            <ArrowUpRight
              className="h-6 w-6 text-ivory group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"
              strokeWidth={1.3}
            />
          </div>
        </a>
      </Reveal>
    </section>
  );
}

function VisitSection() {
  return (
    <section className="container-luxe pt-24 pb-8 md:pt-32">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Επισκέψου μας"
            title={
              <>
                Θα μας βρείτε στη <span className="italic text-gold">Λαμπρινή</span>.
              </>
            }
            description={`${site.address.street}, ${site.address.area}, ${site.address.city}.`}
          />
          <div className="mt-10 space-y-3 text-sm text-ivory">
            <div className="flex gap-6 border-t border-white/8 pt-4">
              <span className="eyebrow w-24 text-muted-foreground">
                Τηλέφωνο
              </span>
              <a href={site.phoneHref} className="gold-underline">
                {site.phone}
              </a>
            </div>
            <div className="flex gap-6 border-t border-white/8 pt-4">
              <span className="eyebrow w-24 text-muted-foreground">
                Email
              </span>
              <a href={`mailto:${site.email}`} className="gold-underline">
                {site.email}
              </a>
            </div>
            <div className="flex gap-6 border-t border-b border-white/8 py-4">
              <span className="eyebrow w-24 text-muted-foreground">
                Ώρες
              </span>
              <div className="space-y-1">
                {site.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-8">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 flex gap-4">
            <LuxeLink to="/book">Ραντεβού</LuxeLink>
            <LuxeAnchor
              href={site.mapsLink}
              variant="outline"
              target="_blank"
              rel="noreferrer"
            >
              Οδηγίες
            </LuxeAnchor>
          </div>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] lg:aspect-auto lg:h-full min-h-[420px]">
              <iframe
                title="La Barbería Social Club — Τοποθεσία"
                src={site.mapsEmbed}
                loading="lazy"
                className="h-full w-full grayscale contrast-[0.9] opacity-90"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
