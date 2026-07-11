import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { site, services, team, gallery, reviews } from "@/lib/site";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LuxeLink, LuxeAnchor } from "@/components/site/LuxeButton";
import { ServiceRow } from "@/components/site/ServiceRow";
import { TeamCard } from "@/components/site/TeamCard";
import { ReviewCard } from "@/components/site/ReviewCard";
import { Instagram, ArrowUpRight } from "lucide-react";

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
      <ReviewsSection />
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
        alt="La Barberia Social Club interior"
        width={1920}
        height={1280}
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
          Galatsi · Athens · Est. La Barberia
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-display text-[3.2rem] sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.95] text-ivory max-w-5xl"
        >
          The gentleman's
          <br />
          ritual, <span className="italic text-gold">reimagined.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 max-w-xl text-lg text-ivory/80 leading-relaxed"
        >
          A private, members-styled barbershop in the heart of Galatsi.
          Traditional grooming, honed by decades of craft, delivered as
          modern hospitality.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <LuxeLink to="/book">Book Appointment</LuxeLink>
          <LuxeLink to="/services" variant="outline">
            View services
          </LuxeLink>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 right-8 hidden md:flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-ivory/50 rotate-[-90deg] origin-bottom-right pb-24"
      >
        <span className="w-8 h-px bg-ivory/40" />
        Scroll
      </motion.div>
    </section>
  );
}

function IntroStrip() {
  return (
    <section className="container-luxe py-32 md:py-48">
      <div className="grid gap-12 lg:grid-cols-12 items-end">
        <Reveal className="lg:col-span-2 eyebrow">Our philosophy</Reveal>
        <Reveal delay={0.05} className="lg:col-span-9">
          <p className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-ivory">
            We are not a chain, not a franchise, not a trend. We are a
            single room in Galatsi where <span className="italic text-gold">time slows</span>,
            the razor is warm, and every man leaves a little more himself
            than when he arrived.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesPreview() {
  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="grid lg:grid-cols-12 gap-16 mb-12">
        <div className="lg:col-span-6">
          <SectionHeading
            eyebrow="Services"
            title={
              <>
                A short menu, <span className="italic text-gold">immaculately</span> executed.
              </>
            }
          />
        </div>
        <div className="lg:col-span-5 lg:col-start-8 self-end">
          <Reveal delay={0.1}>
            <p className="text-muted-foreground leading-relaxed">
              Six offerings. No upsells. Each one shaped over years of
              practice and refined for a single purpose — to be worth your
              time.
            </p>
          </Reveal>
        </div>
      </div>
      <Stagger stagger={0.08}>
        <div>
          {services.slice(0, 4).map((s) => (
            <ServiceRow key={s.id} service={s} />
          ))}
          <div className="border-t border-white/8" />
        </div>
      </Stagger>
      <Reveal className="mt-12">
        <LuxeLink to="/services" variant="outline">
          Full menu
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
          eyebrow="Meet the team"
          title={
            <>
              Three hands. <span className="italic text-gold">One standard.</span>
            </>
          }
          description="Every member of our team trained under masters in Athens, Milan and London before joining the shop. They stay because we let them work slowly."
        />
      </div>
      <Stagger>
        <div className="grid gap-8 md:grid-cols-3">
          {team.map((m) => (
            <TeamCard key={m.id} member={m} />
          ))}
        </div>
      </Stagger>
      <Reveal className="mt-16">
        <LuxeLink to="/team" variant="outline">
          Meet everyone
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
          eyebrow="Inside the shop"
          title={
            <>
              Rooms designed to be <span className="italic text-gold">used</span>, not looked at.
            </>
          }
        />
      </div>
      <Stagger stagger={0.1}>
        <div className="container-luxe grid gap-4 md:gap-6 md:grid-cols-6">
          <StaggerItem className="md:col-span-4">
            <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-charcoal">
              <img
                src={gallery[0].src}
                alt={gallery[0].alt}
                loading="lazy"
                className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
              />
            </div>
          </StaggerItem>
          <StaggerItem className="md:col-span-2">
            <div className="overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto md:h-full bg-charcoal">
              <img
                src={gallery[3].src}
                alt={gallery[3].alt}
                loading="lazy"
                className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
              />
            </div>
          </StaggerItem>
          <StaggerItem className="md:col-span-2">
            <div className="overflow-hidden rounded-2xl aspect-[4/5] md:aspect-auto md:h-full bg-charcoal">
              <img
                src={gallery[2].src}
                alt={gallery[2].alt}
                loading="lazy"
                className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
              />
            </div>
          </StaggerItem>
          <StaggerItem className="md:col-span-4">
            <div className="overflow-hidden rounded-2xl aspect-[16/10] bg-charcoal">
              <img
                src={gallery[1].src}
                alt={gallery[1].alt}
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
            Full gallery
          </LuxeLink>
        </Reveal>
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="mb-16">
        <SectionHeading
          eyebrow="Kind words"
          title={
            <>
              A quiet <span className="italic text-gold">chorus</span> of regulars.
            </>
          }
        />
      </div>
      <Stagger stagger={0.1}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </Stagger>
      <Reveal className="mt-14">
        <LuxeLink to="/reviews" variant="outline">
          Read more
        </LuxeLink>
      </Reveal>
    </section>
  );
}

function InstagramCTA() {
  return (
    <section className="container-luxe py-24 md:py-32">
      <Reveal>
        <a
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          className="group block card-elegant p-12 md:p-20 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="eyebrow mb-4 text-gold">Follow along</div>
              <h3 className="font-display text-4xl md:text-6xl text-ivory leading-tight">
                Instagram —<br />
                <span className="italic">@labarberiasocialclub</span>
              </h3>
              <p className="mt-6 text-muted-foreground max-w-md">
                A slow feed of details, portraits, and the occasional glass
                of whisky.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Instagram
                className="h-12 w-12 text-gold group-hover:rotate-6 transition-transform duration-700"
                strokeWidth={1.2}
              />
              <ArrowUpRight
                className="h-8 w-8 text-ivory group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"
                strokeWidth={1.3}
              />
            </div>
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
            eyebrow="Visit"
            title={
              <>
                Find us in <span className="italic text-gold">Galatsi</span>.
              </>
            }
            description={site.address.street + ", " + site.address.city + ", " + site.address.country + ". A short walk from Alsos Veikou."}
          />
          <div className="mt-10 space-y-3 text-sm text-ivory">
            <div className="flex gap-6 border-t border-white/8 pt-4">
              <span className="eyebrow w-24 text-muted-foreground">
                Phone
              </span>
              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="gold-underline"
              >
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
                Hours
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
            <LuxeLink to="/book">Book</LuxeLink>
            <LuxeAnchor
              href={site.mapsLink}
              variant="outline"
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </LuxeAnchor>
          </div>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] lg:aspect-auto lg:h-full min-h-[420px]">
              <iframe
                title="La Barberia Social Club — Location"
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
