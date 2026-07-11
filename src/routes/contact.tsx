"use client";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { site } from "@/lib/site";
import { LuxeAnchor, LuxeButton } from "@/components/site/LuxeButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — La Barberia Social Club" },
      {
        name: "description",
        content:
          "Get in touch with La Barberia Social Club — visit us in Galatsi, Athens, call, email or find us on Instagram.",
      },
      { property: "og:title", content: "Contact — La Barberia" },
      {
        property: "og:description",
        content: "Say hello. We reply within one working day.",
      },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().min(2, "Please share your name"),
  email: z.string().email("A valid email please"),
  message: z.string().min(10, "A few more words, please"),
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
    // Submission wiring intentionally deferred (no backend yet).
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Thank you — we'll be in touch shortly.");
    reset();
  };

  return (
    <>
      <Toaster theme="dark" position="bottom-center" />
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Say <span className="italic text-gold">hello.</span>
          </>
        }
        description="We reply within one working day. For same-day bookings, please call."
      />

      <section className="container-luxe pb-32 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-10">
          <Reveal>
            <div>
              <div className="eyebrow mb-3">Visit</div>
              <p className="font-display text-2xl text-ivory">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}, {site.address.country}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div>
              <div className="eyebrow mb-3">Phone</div>
              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
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
                className="font-display text-2xl text-ivory gold-underline"
              >
                {site.email}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <div className="eyebrow mb-3">Hours</div>
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
              Directions
            </LuxeAnchor>
            <LuxeAnchor
              href={site.instagram}
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
              <div className="eyebrow">Send a message</div>
              <Field
                label="Your name"
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
                label="Message"
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
                  {isSubmitting ? "Sending…" : "Send message"}
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
              title="La Barberia Social Club — Location"
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
