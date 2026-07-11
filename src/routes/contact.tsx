"use client";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { site } from "@/lib/site";
import { LuxeAnchor, LuxeButton } from "@/components/site/LuxeButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Επικοινωνία — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Επικοινωνήστε μαζί μας — τηλέφωνο, email, διεύθυνση και ώρες λειτουργίας του La Barbería Social Club στη Λαμπρινή.",
      },
      { property: "og:title", content: "Επικοινωνία — La Barbería" },
      {
        property: "og:description",
        content: "Πείτε μας γεια. Απαντάμε εντός μίας εργάσιμης ημέρας.",
      },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().min(2, "Πείτε μας το όνομά σας"),
  email: z.string().email("Ένα έγκυρο email παρακαλώ"),
  message: z.string().min(10, "Λίγα λόγια ακόμη, παρακαλώ"),
});

type FormValues = z.infer<typeof schema>;

function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (_values: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Ευχαριστούμε — θα σας απαντήσουμε σύντομα.");
    reset();
  };

  return (
    <>
      <Toaster theme="dark" position="bottom-center" />
      <PageHeader
        eyebrow="Επικοινωνία"
        title={
          <>
            Πείτε μας <span className="italic text-gold">γεια.</span>
          </>
        }
        description="Απαντάμε εντός μίας εργάσιμης ημέρας. Για ραντεβού την ίδια ημέρα, καλέστε μας."
      />

      <section className="container-luxe pb-32 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-10">
          <Reveal>
            <div>
              <div className="eyebrow mb-3">Διεύθυνση</div>
              <p className="font-display text-2xl text-ivory">
                {site.address.street}, {site.address.area}
                <br />
                {site.address.postalCode} {site.address.city}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div>
              <div className="eyebrow mb-3">Τηλέφωνο</div>
              <a
                href={site.phoneHref}
                className="font-display text-2xl text-ivory gold-underline"
              >
                {site.phone}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <div className="eyebrow mb-3">Email</div>
              <a
                href={`mailto:${site.email}`}
                className="font-display text-2xl text-ivory gold-underline break-all"
              >
                {site.email}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <div className="eyebrow mb-3">Ώρες</div>
              <ul className="space-y-1 text-ivory">
                {site.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-8 text-sm">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span>{h.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="flex gap-3">
            <LuxeAnchor
              href={site.mapsLink}
              variant="outline"
              target="_blank"
              rel="noreferrer"
            >
              Οδηγίες
            </LuxeAnchor>
            <LuxeAnchor
              href={site.socials.instagram}
              variant="ghost"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </LuxeAnchor>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card-elegant p-8 md:p-12 space-y-8"
              noValidate
            >
              <div className="eyebrow">Στείλτε μας μήνυμα</div>
              <Field
                label="Το όνομά σας"
                error={errors.name?.message}
                input={
                  <input
                    type="text"
                    autoComplete="name"
                    {...register("name")}
                    className={inputCls}
                  />
                }
              />
              <Field
                label="Email"
                error={errors.email?.message}
                input={
                  <input
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    className={inputCls}
                  />
                }
              />
              <Field
                label="Μήνυμα"
                error={errors.message?.message}
                input={
                  <textarea
                    rows={5}
                    {...register("message")}
                    className={`${inputCls} resize-none`}
                  />
                }
              />
              <div className="pt-2">
                <LuxeButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Αποστολή…" : "Αποστολή μηνύματος"}
                </LuxeButton>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe pb-32">
        <Reveal>
          <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[16/9]">
            <iframe
              title="La Barbería Social Club — Τοποθεσία"
              src={site.mapsEmbed}
              loading="lazy"
              className="h-full w-full grayscale contrast-[0.9] opacity-90"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3 text-ivory placeholder:text-muted-foreground transition-colors duration-300";

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-3 text-muted-foreground">
        {label}
      </span>
      {input}
      {error ? (
        <span className="mt-2 block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
