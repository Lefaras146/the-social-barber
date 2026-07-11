import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, Stagger } from "@/components/site/Reveal";
import { ServiceRowBook } from "@/components/site/ServiceRow";
import { services, serviceCategories } from "@/lib/site";
import { LuxeLink } from "@/components/site/LuxeButton";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Υπηρεσίες — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Κουρέματα, γένια, ξύρισμα και περιποίηση. Ο πλήρης τιμοκατάλογος του La Barbería Social Club στη Λαμπρινή.",
      },
      { property: "og:title", content: "Υπηρεσίες — La Barbería" },
      {
        property: "og:description",
        content:
          "Παραδοσιακό grooming με ακρίβεια. Δείτε τον πλήρη τιμοκατάλογο.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Υπηρεσίες"
        title={
          <>
            Παραδοσιακό grooming, <br />
            <span className="italic text-gold">με ακρίβεια.</span>
          </>
        }
        description="Κουρέματα, γένια & ξύρισμα, περιποίηση προσώπου. Οι τιμές είναι τελικές."
      />
      <section className="container-luxe pb-24 space-y-24">
        {serviceCategories.map((cat) => (
          <div key={cat}>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl text-ivory mb-2">
                {cat}
              </h2>
            </Reveal>
            <Stagger stagger={0.05}>
              <div>
                {services
                  .filter((s) => s.category === cat)
                  .map((s) => (
                    <ServiceRowBook key={s.id} service={s} />
                  ))}
                <div className="border-t border-white/8" />
              </div>
            </Stagger>
          </div>
        ))}
        <div className="pt-4 flex flex-wrap gap-4">
          <LuxeLink to="/book">Κλείσε ραντεβού</LuxeLink>
          <LuxeLink to="/contact" variant="outline">
            Ρώτησέ μας
          </LuxeLink>
        </div>
      </section>
    </>
  );
}
