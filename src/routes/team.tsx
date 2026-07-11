import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Stagger } from "@/components/site/Reveal";
import { TeamCard } from "@/components/site/TeamCard";
import { team } from "@/lib/site";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Meet the Team — La Barberia Social Club" },
      {
        name: "description",
        content:
          "Meet the barbers of La Barberia Social Club — master craftsmen trained in Athens, Milan and London.",
      },
      { property: "og:title", content: "Meet the Team — La Barberia" },
      {
        property: "og:description",
        content:
          "Three hands. One standard. Meet the barbers behind La Barberia Social Club.",
      },
    ],
  }),
  component: Team,
});

function Team() {
  return (
    <>
      <PageHeader
        eyebrow="Meet the team"
        title={
          <>
            Three hands. <br />
            <span className="italic text-gold">One standard.</span>
          </>
        }
        description="Every member of our team trained under masters in Athens, Milan and London. They stay because we let them work at the pace their craft deserves."
      />
      <section className="container-luxe pb-32">
        <Stagger>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <TeamCard key={m.id} member={m} />
            ))}
          </div>
        </Stagger>
      </section>
    </>
  );
}
