import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { site } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — La Barberia Social Club" },
      {
        name: "description",
        content:
          "Terms of service and booking policy for La Barberia Social Club.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description={`Last updated ${new Date().getFullYear()}. By using this website or booking an appointment, you agree to the following.`}
      />
      <section className="container-luxe pb-32 max-w-3xl">
        <Reveal>
          <article className="space-y-8 text-muted-foreground leading-relaxed">
            <Block title="Bookings">
              Appointments requested online are provisional until we
              confirm by phone or email. Please treat a confirmed
              appointment as a commitment — a chair is set aside for you.
            </Block>
            <Block title="Cancellations">
              Cancellations more than twenty-four hours in advance are
              free. Within twenty-four hours, we may ask for a small
              rebooking fee to hold your next visit.
            </Block>
            <Block title="Payment">
              Payment is taken in-shop after your service. We accept
              cards, cash and contactless. Tipping is welcomed but never
              expected.
            </Block>
            <Block title="Products">
              Products are sold in-shop only. Unopened items may be
              returned within fourteen days with proof of purchase.
            </Block>
            <Block title="Website">
              Content on this site is © La Barberia Social Club unless
              otherwise noted. Please do not reuse photography without
              written permission.
            </Block>
            <Block title="Contact">
              Questions about these terms? Write to {site.email}.
            </Block>
          </article>
        </Reveal>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/10 pt-8">
      <h2 className="font-display text-2xl text-ivory mb-3">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
