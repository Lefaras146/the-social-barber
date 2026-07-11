import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Stagger, StaggerItem } from "@/components/site/Reveal";
import { gallery } from "@/lib/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Στιγμιότυπα από τον χώρο του La Barbería Social Club στη Λαμπρινή, Αθήνα.",
      },
      { property: "og:title", content: "Gallery — La Barbería" },
      {
        property: "og:description",
        content: "Μια ματιά μέσα στο κουρείο.",
      },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title={
          <>
            Μια ματιά <br />
            <span className="italic text-gold">μέσα στο κουρείο.</span>
          </>
        }
        description="Στιγμιότυπα και λεπτομέρειες από το La Barbería Social Club."
      />
      <section className="container-luxe pb-32">
        <Stagger stagger={0.1}>
          <div className="grid gap-6 md:grid-cols-6">
            <StaggerItem className="md:col-span-4">
              <Frame src={gallery[0].src} alt={gallery[0].alt} ratio="aspect-[16/10]" />
            </StaggerItem>
            <StaggerItem className="md:col-span-2">
              <Frame src={gallery[1].src} alt={gallery[1].alt} ratio="aspect-[4/5]" />
            </StaggerItem>
            <StaggerItem className="md:col-span-2">
              <Frame src={gallery[2].src} alt={gallery[2].alt} ratio="aspect-[4/5]" />
            </StaggerItem>
            <StaggerItem className="md:col-span-4">
              <Frame src={gallery[3].src} alt={gallery[3].alt} ratio="aspect-[16/10]" />
            </StaggerItem>
            <StaggerItem className="md:col-span-6">
              <Frame src={gallery[4].src} alt={gallery[4].alt} ratio="aspect-[21/9]" />
            </StaggerItem>
          </div>
        </Stagger>
      </section>
    </>
  );
}

function Frame({
  src,
  alt,
  ratio,
}: {
  src: string;
  alt: string;
  ratio: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-charcoal ${ratio}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
      />
    </div>
  );
}
