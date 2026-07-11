import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { site } from "@/lib/site";
import { LuxeAnchor } from "@/components/site/LuxeButton";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Κριτικές — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Δείτε τις κριτικές των πελατών μας στη Google για το La Barbería Social Club στη Λαμπρινή.",
      },
      { property: "og:title", content: "Κριτικές — La Barbería" },
      {
        property: "og:description",
        content: "Τι λένε για μας οι πελάτες μας στη Google.",
      },
    ],
  }),
  component: Reviews,
});

function Reviews() {
  return (
    <>
      <PageHeader
        eyebrow="Κριτικές"
        title={
          <>
            Τι <span className="italic text-gold">λένε</span> <br />
            για μας.
          </>
        }
        description="Οι πραγματικές κριτικές των πελατών μας ζουν στη Google. Πατήστε παρακάτω για να τις δείτε ή για να αφήσετε τη δική σας."
      />
      <section className="container-luxe pb-32">
        <Reveal>
          <div className="card-elegant p-10 md:p-16 text-center">
            <div className="flex justify-center gap-1 text-gold mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-gold" strokeWidth={0} />
              ))}
            </div>
            <p className="font-display text-3xl md:text-5xl text-ivory leading-tight max-w-3xl mx-auto">
              Ευχαριστούμε κάθε πελάτη που μας εμπιστεύτηκε και βρήκε το
              χρόνο να γράψει δυο λόγια για εμάς.
            </p>
            <div className="mt-12 flex justify-center">
              <LuxeAnchor
                href={site.googleReviewsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Δες τις κριτικές στη Google
              </LuxeAnchor>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
