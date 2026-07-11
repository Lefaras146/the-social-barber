import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Stagger } from "@/components/site/Reveal";
import { TeamCard } from "@/components/site/TeamCard";
import { team } from "@/lib/site";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Η ομάδα — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Γνωρίστε την ομάδα του La Barbería Social Club — έμπειροι επαγγελματίες κουρείς με έμφαση στην τεχνική και τη λεπτομέρεια.",
      },
      { property: "og:title", content: "Η ομάδα — La Barbería" },
      {
        property: "og:description",
        content:
          "Έμπειροι επαγγελματίες με έμφαση στην τεχνική και το αυθεντικό grooming.",
      },
    ],
  }),
  component: Team,
});

function Team() {
  return (
    <>
      <PageHeader
        eyebrow="Η ομάδα μας"
        title={
          <>
            Έμπειροι επαγγελματίες. <br />
            <span className="italic text-gold">Ένα standard.</span>
          </>
        }
        description="Η ομάδα του La Barbería Social Club αποτελείται από έμπειρους επαγγελματίες κουρείς, με έμφαση στην τεχνική, τη λεπτομέρεια και το αυθεντικό grooming."
      />
      <section className="container-luxe pb-32">
        <Stagger>
          <div className="grid gap-12 md:grid-cols-2 max-w-4xl">
            {team.map((m) => (
              <TeamCard key={m.id} member={m} />
            ))}
          </div>
        </Stagger>
      </section>
    </>
  );
}
