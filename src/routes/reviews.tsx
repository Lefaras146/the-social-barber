import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Stagger } from "@/components/site/Reveal";
import { ReviewCard } from "@/components/site/ReviewCard";
import { reviews } from "@/lib/site";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — La Barberia Social Club" },
      {
        name: "description",
        content:
          "What our regulars say about La Barberia Social Club — Google reviews from clients in Athens and beyond.",
      },
      { property: "og:title", content: "Reviews — La Barberia" },
      {
        property: "og:description",
        content:
          "A quiet chorus of regulars. Read what our clients say about La Barberia Social Club.",
      },
    ],
  }),
  component: Reviews,
});

function Reviews() {
  return (
    <>
      <PageHeader
        eyebrow="Kind words"
        title={
          <>
            A quiet <span className="italic text-gold">chorus</span> <br />
            of regulars.
          </>
        }
        description="A selection of recent Google reviews from clients who have taken the time to write."
      />
      <section className="container-luxe pb-32">
        <Stagger stagger={0.08}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </Stagger>
      </section>
    </>
  );
}
