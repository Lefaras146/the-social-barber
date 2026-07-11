import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Stagger } from "@/components/site/Reveal";
import { ServiceRowBook } from "@/components/site/ServiceRow";
import { services } from "@/lib/site";
import { LuxeLink } from "@/components/site/LuxeButton";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — La Barberia Social Club" },
      {
        name: "description",
        content:
          "Signature cuts, straight-razor shaves, beard sculpting and the Social Ritual. Our full menu of grooming services in Galatsi, Athens.",
      },
      { property: "og:title", content: "Services — La Barberia Social Club" },
      {
        property: "og:description",
        content:
          "A short menu, immaculately executed. Explore our full grooming services.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            A short menu, <br />
            <span className="italic text-gold">immaculately executed.</span>
          </>
        }
        description="Six offerings. No upsells. Prices include hot towel, consultation and a quiet drink of your choice."
      />
      <section className="container-luxe pb-24">
        <Stagger stagger={0.06}>
          <div>
            {services.map((s) => (
              <ServiceRowBook key={s.id} service={s} />
            ))}
            <div className="border-t border-white/8" />
          </div>
        </Stagger>
        <div className="mt-16 flex flex-wrap gap-4">
          <LuxeLink to="/book">Book Appointment</LuxeLink>
          <LuxeLink to="/contact" variant="outline">
            Ask a question
          </LuxeLink>
        </div>
      </section>
    </>
  );
}
