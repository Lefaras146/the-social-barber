import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { site } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Πολιτική Απορρήτου — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Πώς συλλέγει, χρησιμοποιεί και προστατεύει τα προσωπικά σας δεδομένα το La Barbería Social Club.",
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
        eyebrow="Νομικά"
        title="Πολιτική Απορρήτου"
        description={`Τελευταία ενημέρωση: ${new Date().getFullYear()}. Το La Barbería Social Club σέβεται την ιδιωτικότητά σας και διαχειρίζεται τα προσωπικά σας δεδομένα με προσοχή.`}
      />
      <section className="container-luxe pb-32 max-w-3xl">
        <Reveal>
          <article className="space-y-8 text-muted-foreground leading-relaxed">
            <Block title="Δεδομένα που συλλέγουμε">
              Συλλέγουμε μόνο τις πληροφορίες που είναι απαραίτητες για
              την κράτηση και τη διαχείριση του ραντεβού σας: όνομα,
              τηλέφωνο, email και την υπηρεσία που ζητήσατε. Αν
              επικοινωνήσετε μαζί μας, διατηρούμε το μήνυμά σας μέχρι να
              επιλυθεί.
            </Block>
            <Block title="Πώς τα χρησιμοποιούμε">
              Για την επιβεβαίωση και υπενθύμιση των ραντεβού σας, για
              επικοινωνία σε περίπτωση αλλαγών και — εφόσον το επιλέξετε
              — για ενημερώσεις σχετικές με το κουρείο.
            </Block>
            <Block title="Ποιος έχει πρόσβαση">
              Μόνο το La Barbería Social Club και, όπου απαιτείται, οι
              πάροχοι υπηρεσιών που υποστηρίζουν το σύστημα κρατήσεων
              και email. Δεν πουλάμε και δεν διαμοιραζόμαστε τα δεδομένα
              σας για διαφημιστικούς σκοπούς.
            </Block>
            <Block title="Τα δικαιώματά σας">
              Μπορείτε ανά πάσα στιγμή να ζητήσετε πρόσβαση, διόρθωση ή
              διαγραφή των δεδομένων σας στο {site.email}. Απαντάμε εντός
              τριάντα ημερών.
            </Block>
            <Block title="Cookies">
              Ο ιστότοπός μας χρησιμοποιεί μόνο τα απολύτως απαραίτητα
              cookies για τη λειτουργία του. Δεν χρησιμοποιούμε cookies
              παρακολούθησης ή διαφήμισης.
            </Block>
            <Block title="Επικοινωνία">
              Ερωτήσεις; Επικοινωνήστε στο {site.email} ή στο {site.phone}.
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
