import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { site } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — La Barberia Social Club" },
      {
        name: "description",
        content:
          "How La Barberia Social Club collects, uses and protects your personal information.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Last updated ${new Date().getFullYear()}. La Barberia Social Club respects your privacy and handles personal data with care.`}
      />
      <section className="container-luxe pb-32 max-w-3xl">
        <Reveal>
          <article className="prose-invert space-y-8 text-muted-foreground leading-relaxed">
            <Block title="Data we collect">
              We collect only the information necessary to book and manage
              your appointment: your name, phone number, email, and the
              service requested. If you contact us, we retain your message
              until it is resolved.
            </Block>
            <Block title="How we use it">
              To confirm and remember your appointments, to contact you if
              plans change, and — if you opt in — to occasionally share
              news from the shop.
            </Block>
            <Block title="Who sees it">
              Only La Barberia Social Club and, when necessary, the
              service providers that help us run our booking and email
              systems. We do not sell, trade or share your data with
              third-party advertisers.
            </Block>
            <Block title="Your rights">
              You may request access to, correction of, or deletion of
              your data at any time by writing to {site.email}. We respond
              within thirty days.
            </Block>
            <Block title="Cookies">
              Our website uses only essential cookies required for it to
              function. We do not use tracking or advertising cookies.
            </Block>
            <Block title="Contact">
              Questions? Reach us at {site.email} or {site.phone}.
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
