"use client";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { services, team } from "@/lib/site";
import { LuxeButton } from "@/components/site/LuxeButton";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Appointment — La Barberia Social Club" },
      {
        name: "description",
        content:
          "Reserve your appointment at La Barberia Social Club in Galatsi, Athens. Cuts, shaves and the Social Ritual.",
      },
      { property: "og:title", content: "Book — La Barberia Social Club" },
      {
        property: "og:description",
        content:
          "Reserve your appointment. Cuts, shaves, and the Social Ritual.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Book,
});

const schema = z.object({
  service: z.string().min(1, "Please choose a service"),
  barber: z.string().min(1, "Please choose a barber"),
  date: z.string().min(1, "Please pick a date"),
  time: z.string().min(1, "Please pick a time"),
  name: z.string().min(2, "Your name, please"),
  phone: z.string().min(6, "A phone number so we can confirm"),
  email: z.string().email("A valid email please"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const times = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

function Book() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      barber: "any",
    },
  });

  const onSubmit = async (_values: FormValues) => {
    // Booking backend intentionally deferred.
    await new Promise((r) => setTimeout(r, 700));
    toast.success(
      "Requested — we'll confirm your appointment by phone or email.",
    );
    reset({ barber: "any" });
  };

  return (
    <>
      <Toaster theme="dark" position="bottom-center" />
      <PageHeader
        eyebrow="Book appointment"
        title={
          <>
            Reserve <br />
            <span className="italic text-gold">your chair.</span>
          </>
        }
        description="Requests are confirmed by phone or email within a working day. For same-day appointments, please call."
      />

      <section className="container-luxe pb-32">
        <Reveal>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-elegant p-8 md:p-12 grid gap-8 md:grid-cols-2"
            noValidate
          >
            <Field label="Service" error={errors.service?.message}>
              <select {...register("service")} className={selectCls}>
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.price} · {s.duration}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Barber" error={errors.barber?.message}>
              <select {...register("barber")} className={selectCls}>
                <option value="any">Any available barber</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Preferred date" error={errors.date?.message}>
              <input type="date" {...register("date")} className={inputCls} />
            </Field>

            <Field label="Preferred time" error={errors.time?.message}>
              <select {...register("time")} className={selectCls}>
                <option value="">Select a time</option>
                {times.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Your name" error={errors.name?.message}>
              <input
                type="text"
                autoComplete="name"
                {...register("name")}
                className={inputCls}
              />
            </Field>

            <Field label="Phone" error={errors.phone?.message}>
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
              <Field label="Notes (optional)" error={errors.notes?.message}>
                <textarea
                  rows={4}
                  {...register("notes")}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>

            <div className="md:col-span-2 pt-2 flex flex-wrap items-center gap-6">
              <LuxeButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Requesting…" : "Request appointment"}
              </LuxeButton>
              <p className="text-xs text-muted-foreground max-w-sm">
                By requesting, you agree to our terms and to receive a
                confirmation contact. No charges are made online.
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
