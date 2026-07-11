import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { site } from "@/lib/site";
import { LuxeLink } from "@/components/site/LuxeButton";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — La Barberia Social Club" },
      {
        name: "description",
        content:
          "Our story, our philosophy, our craft. La Barberia Social Club is a private, luxury barbershop in Galatsi, Athens.",
      },
      { property: "og:title", content: "About — La Barberia Social Club" },
      {
        property: "og:description",
        content:
          "A private, luxury barbershop in Galatsi, Athens. Our philosophy of quiet craft.",
      },
    ],
  }),
  component: About,
});

const pillars = [
  {
    n: "01",
    title: "Time",
    body: "Every appointment is booked with generous margin. No overlap, no rush, no distraction. Your hour is yours.",
  },
  {
    n: "02",
    title: "Craft",
    body: "Scissor-over-comb, straight-razor, hot towels, warm oils. The old techniques, executed with the discipline of a workshop.",
  },
  {
    n: "03",
    title: "Restraint",
    body: "A short menu. Considered products. No showmanship. What matters is the result — and how you feel walking out.",
  },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            A single room. <br />
            <span className="italic text-gold">A single standard.</span>
          </>
        }
        description="Founded in Galatsi, La Barberia Social Club was built as a quiet counterpoint to the noise of modern grooming — a place where the ritual of the barber is honoured, and every man is treated as a regular from his first visit."
      />

      <section className="container-luxe grid lg:grid-cols-12 gap-16 pb-24 md:pb-32">
        <Reveal className="lg:col-span-6">
          <div className="rounded-2xl overflow-hidden aspect-[4/5]">
            <img
              src={site.images.about}
              alt="Barber tools on walnut"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
        <div className="lg:col-span-6 lg:pt-12 space-y-8">
          <Reveal>
            <div className="eyebrow">Our story</div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-display text-2xl md:text-3xl leading-snug text-ivory">
              We opened with two chairs, a single mirror, and the belief
              that a haircut should never feel like a transaction.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground leading-relaxed">
              Alexandros founded the shop after fifteen years cutting hair
              between Milan, London and Athens. What he missed, in every
              city, was a room that respected the ritual — one that
              treated the barber's craft as something closer to tailoring
              than to service.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-muted-foreground leading-relaxed">
              La Barberia Social Club is our answer. A shop of matte black
              and walnut, warm light and quiet music. A short menu of
              deliberately considered services. And a team that stays
              because we let them work slowly.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <LuxeLink to="/book">Book your first visit</LuxeLink>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe pb-32">
        <Reveal>
          <div className="eyebrow mb-10">Three pillars</div>
        </Reveal>
        <Stagger>
          <div className="grid gap-12 md:grid-cols-3">
            {pillars.map((p) => (
              <StaggerItem key={p.n}>
                <div className="border-t border-white/12 pt-6">
                  <div className="font-display text-gold text-3xl mb-6">
                    {p.n}
                  </div>
                  <h3 className="font-display text-3xl text-ivory mb-4">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>
    </>
  );
}
