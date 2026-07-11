import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { site } from "@/lib/site";
import { LuxeLink } from "@/components/site/LuxeButton";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Το κουρείο — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Η ιστορία, η φιλοσοφία και το στυλ μας. Χώρος ανδρικής περιποίησης στη Λαμπρινή, Αθήνα.",
      },
      { property: "og:title", content: "Το κουρείο — La Barbería" },
      {
        property: "og:description",
        content:
          "Παραδοσιακό κουρείο με σύγχρονη ματιά. Ένας χώρος συνάντησης.",
      },
    ],
  }),
  component: About,
});

const pillars = [
  {
    n: "01",
    title: "Παράδοση",
    body: "Old school φιλοσοφία, παραδοσιακές τεχνικές, με σεβασμό στο επάγγελμα του κουρέα. Οι κλασικές αξίες παραμένουν πάντα επίκαιρες.",
  },
  {
    n: "02",
    title: "Λεπτομέρεια",
    body: "Ηρεμία, ακρίβεια και προσοχή στη λεπτομέρεια σε κάθε υπηρεσία. Κάθε κούρεμα, κάθε γραμμή, κάθε ξύρισμα — όπως ακριβώς πρέπει.",
  },
  {
    n: "03",
    title: "Ατμόσφαιρα",
    body: "Δεν είμαστε απλώς ένα κουρείο. Είμαστε ένας χώρος συνάντησης, όπου η παράδοση, το στυλ και η καλή ατμόσφαιρα συνδυάζονται.",
  },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="Το κουρείο"
        title={
          <>
            Παραδοσιακό κουρείο, <br />
            <span className="italic text-gold">σύγχρονη ματιά.</span>
          </>
        }
        description="Βρισκόμαστε στην Αθήνα όπου δημιουργήσαμε έναν χώρο ανδρικής περιποίησης, εμπνευσμένο από την old school φιλοσοφία του παραδοσιακού κουρείου, προσαρμοσμένο στη σύγχρονη εποχή."
      />

      <section className="container-luxe grid lg:grid-cols-12 gap-16 pb-24 md:pb-32">
        <Reveal className="lg:col-span-6">
          <div className="rounded-2xl overflow-hidden aspect-[4/5]">
            <img
              src={site.images.about1}
              alt="Λεπτομέρεια από το La Barbería"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
        <div className="lg:col-span-6 lg:pt-12 space-y-8">
          <Reveal>
            <div className="eyebrow">Η ιστορία μας</div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-display text-2xl md:text-3xl leading-snug text-ivory">
              Το La Barbería Social Club δεν είναι απλώς ένα κουρείο.
              Είναι ένας χώρος για να μοιράζεσαι στιγμές, να φροντίζεις
              την εικόνα σου και να επιστρέφεις στα βασικά.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground leading-relaxed">
              Ένας χώρος συνάντησης, όπου η παράδοση, το στυλ και η καλή
              ατμόσφαιρα συνδυάζονται. Δίνουμε έμφαση στην τεχνική, τη
              λεπτομέρεια και το αυθεντικό grooming — πάντα με σεβασμό
              στο προσωπικό στυλ και τις ανάγκες του κάθε πελάτη.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <LuxeLink to="/book">Κλείσε το ραντεβού σου</LuxeLink>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe pb-16">
        <Reveal>
          <div className="rounded-2xl overflow-hidden aspect-[21/9]">
            <img
              src={site.images.about2}
              alt="Ο χώρος του La Barbería Social Club"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="container-luxe pb-32">
        <Reveal>
          <div className="eyebrow mb-10">Τρεις αρχές</div>
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
