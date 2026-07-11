import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Stagger, StaggerItem } from "@/components/site/Reveal";
import { gallery } from "@/lib/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — La Barberia Social Club" },
      {
        name: "description",
        content:
          "Portraits and details from La Barberia Social Club — a luxury barbershop in Galatsi, Athens.",
      },
      { property: "og:title", content: "Gallery — La Barberia Social Club" },
      {
        property: "og:description",
        content: "A visual diary of the shop, the work, and the ritual.",
      },
    ],
  }),
  component: Gallery,
});

const aspects = [
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[16/10]",
  "aspect-square",
  "aspect-[3/4]",
];

function Gallery() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title={
          <>
            A visual <br />
            <span className="italic text-gold">diary.</span>
          </>
        }
        description="Portraits, details, and quiet corners from the shop. Photography by our team."
      />
      <section className="container-luxe pb-32">
        <Stagger stagger={0.08}>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {gallery.map((g, i) => (
              <StaggerItem
                key={g.src}
                className="mb-6 break-inside-avoid"
              >
                <div
                  className={`overflow-hidden rounded-2xl bg-charcoal ${aspects[i % aspects.length]}`}
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
                  />
                </div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>
    </>
  );
}
