"use client";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { services, team, site } from "@/lib/site";
import { LuxeButton, LuxeAnchor } from "@/components/site/LuxeButton";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Κλείσε ραντεβού — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Κλείστε το ραντεβού σας στο La Barbería Social Club — Ι. Φωκά 90, Λαμπρινή, Αθήνα.",
      },
      { property: "og:title", content: "Ραντεβού — La Barbería" },
      {
        property: "og:description",
        content: "Κλείστε το ραντεβού σας online.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Book,
});

const schema = z.object({
  service: z.string().min(1, "Επιλέξτε υπηρεσία"),
  barber: z.string().min(1, "Επιλέξτε barber"),
  date: z.string().min(1, "Επιλέξτε ημερομηνία"),
  time: z.string().min(1, "Επιλέξτε ώρα"),
  name: z.string().min(2, "Το όνομά σας, παρακαλώ"),
  phone: z.string().min(6, "Ένα τηλέφωνο για επιβεβαίωση"),
  email: z.string().email("Ένα έγκυρο email παρακαλώ"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const times = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00",
];

function Book() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { barber: "any" },
  });

  const onSubmit = async (_values: FormValues) => {
    await new Promise((r) => setTimeout(r, 700));
    toast.success(
      "Το αίτημα καταχωρήθηκε — θα σας επιβεβαιώσουμε τηλεφωνικά ή με email.",
    );
    reset({ barber: "any" });
  };

  return (
    <>
      <Toaster theme="dark" position="bottom-center" />
      <PageHeader
        eyebrow="Ραντεβού"
        title={
          <>
            Κλείσε <br />
            <span className="italic text-gold">το ραντεβού σου.</span>
          </>
        }
        description="Θα σας επιβεβαιώσουμε τηλεφωνικά ή με email εντός μίας εργάσιμης ημέρας. Για ραντεβού την ίδια ημέρα, καλέστε μας."
      />

      <section className="container-luxe pb-16">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 pb-10 border-b border-white/8">
            <span className="eyebrow text-muted-foreground">
              Προτιμάτε τηλεφωνικά;
            </span>
            <LuxeAnchor href={site.phoneHref} variant="outline">
              {site.phone}
            </LuxeAnchor>
          </div>
        </Reveal>
      </section>

      <section className="container-luxe pb-32">
        <Reveal>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-elegant p-8 md:p-12 grid gap-8 md:grid-cols-2"
            noValidate
          >
            <Field label="Υπηρεσία" error={errors.service?.message}>
              <select {...register("service")} className={selectCls}>
                <option value="">Επιλέξτε υπηρεσία</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.price}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Barber" error={errors.barber?.message}>
              <select {...register("barber")} className={selectCls}>
                <option value="any">Οποιοσδήποτε διαθέσιμος</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ημερομηνία" error={errors.date?.message}>
              <input type="date" {...register("date")} className={inputCls} />
            </Field>

            <Field label="Ώρα" error={errors.time?.message}>
              <select {...register("time")} className={selectCls}>
                <option value="">Επιλέξτε ώρα</option>
                {times.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ονοματεπώνυμο" error={errors.name?.message}>
              <input
                type="text"
                autoComplete="name"
                {...register("name")}
                className={inputCls}
              />
            </Field>

            <Field label="Τηλέφωνο" error={errors.phone?.message}>
              <input
                type="tel"
                autoComplete="tel"
                {...register("phone")}
                className={inputCls}
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Email" error={errors.email?.message}>
                <input
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Σημειώσεις (προαιρετικό)" error={errors.notes?.message}>
                <textarea
                  rows={4}
                  {...register("notes")}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>

            <div className="md:col-span-2 pt-2 flex flex-wrap items-center gap-6">
              <LuxeButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Αποστολή…" : "Αποστολή αιτήματος"}
              </LuxeButton>
              <p className="text-xs text-muted-foreground max-w-sm">
                Αποστέλλοντας το αίτημα, συμφωνείτε με τους όρους μας και
                με τη λήψη επιβεβαίωσης. Δεν πραγματοποιείται καμία
                χρέωση online.
              </p>
            </div>
          </form>
        </Reveal>
      </section>
    </>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3 text-ivory placeholder:text-muted-foreground transition-colors duration-300";

const selectCls = `${inputCls} appearance-none [color-scheme:dark]`;

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-3 text-muted-foreground">{label}</span>
      {children}
      {error ? (
        <span className="mt-2 block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
