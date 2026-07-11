import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { site } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Όροι Χρήσης — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Όροι χρήσης και πολιτική κρατήσεων του La Barbería Social Club.",
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
        eyebrow="Νομικά"
        title="Όροι Χρήσης"
        description={`Τελευταία ενημέρωση: ${new Date().getFullYear()}. Με τη χρήση αυτού του ιστότοπου ή την κράτηση ραντεβού, αποδέχεστε τα παρακάτω.`}
      />
      <section className="container-luxe pb-32 max-w-3xl">
        <Reveal>
          <article className="space-y-8 text-muted-foreground leading-relaxed">
            <Block title="Κρατήσεις">
              Τα ραντεβού που ζητούνται online θεωρούνται προσωρινά μέχρι
              να επιβεβαιωθούν τηλεφωνικά ή με email. Παρακαλούμε
              θεωρήστε ένα επιβεβαιωμένο ραντεβού ως δέσμευση — μια θέση
              φυλάσσεται για εσάς.
            </Block>
            <Block title="Ακυρώσεις">
              Οι ακυρώσεις πάνω από είκοσι τέσσερις ώρες πριν είναι
              δωρεάν. Εντός εικοσιτετραώρου ενδέχεται να ζητηθεί μικρή
              χρέωση κράτησης για την επόμενη επίσκεψη.
            </Block>
            <Block title="Πληρωμή">
              Η πληρωμή πραγματοποιείται στο κατάστημα μετά την υπηρεσία.
              Δεχόμαστε κάρτες, μετρητά και ανέπαφες συναλλαγές. Το
              φιλοδώρημα είναι ευπρόσδεκτο αλλά όχι υποχρεωτικό.
            </Block>
            <Block title="Ιστότοπος">
              Το περιεχόμενο του ιστότοπου αποτελεί © La Barbería Social
              Club, εκτός αν αναφέρεται διαφορετικά. Παρακαλούμε μην
              αναπαράγετε τις φωτογραφίες χωρίς γραπτή άδεια.
            </Block>
            <Block title="Επικοινωνία">
              Ερωτήσεις σχετικά με τους όρους; Γράψτε μας στο {site.email}.
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
