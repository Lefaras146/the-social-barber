"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  listBarbersFn,
  listServicesFn,
  getAvailabilityFn,
  createBookingFn,
  type PublicBarber,
  type PublicService,
} from "@/lib/booking.functions";
import { useBooking } from "@/lib/booking-context";
import { cn } from "@/lib/utils";

const STEP_LABELS = [
  "Υπηρεσία",
  "Barber",
  "Ημερομηνία",
  "Ώρα",
  "Στοιχεία",
  "Επιβεβαίωση",
  "Ολοκλήρωση",
];

const EASE = [0.22, 1, 0.36, 1] as const;

const GREEK_MONTHS = [
  "Ιαν", "Φεβ", "Μαρ", "Απρ", "Μάι", "Ιούν",
  "Ιούλ", "Αύγ", "Σεπ", "Οκτ", "Νοέ", "Δεκ",
];
const GREEK_WEEKDAYS = ["Κυρ", "Δευ", "Τρί", "Τετ", "Πέμ", "Παρ", "Σάβ"];

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDate(dateYmd: string) {
  const [y, m, d] = dateYmd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${GREEK_WEEKDAYS[date.getDay()]} ${d} ${GREEK_MONTHS[m - 1]}`;
}

function formatEuro(cents: number) {
  return `${(cents / 100).toFixed(0).replace(/\.0+$/, "")}€`;
}

export function BookingOverlay() {
  const { isOpen, close, initialServiceId, initialBarberId } = useBooking();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [pickedBarberForSlot, setPickedBarberForSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmation, setConfirmation] = useState<{
    code: string;
    startAt: string;
    barberName: string;
    serviceName: string;
    priceCents: number;
  } | null>(null);

  const listServices = useServerFn(listServicesFn);
  const listBarbers = useServerFn(listBarbersFn);
  const getAvailability = useServerFn(getAvailabilityFn);
  const createBooking = useServerFn(createBookingFn);

  const servicesQ = useQuery({
    queryKey: ["booking", "services"],
    queryFn: () => listServices(),
    enabled: isOpen,
    staleTime: 5 * 60_000,
  });
  const barbersQ = useQuery({
    queryKey: ["booking", "barbers"],
    queryFn: () => listBarbers(),
    enabled: isOpen,
    staleTime: 5 * 60_000,
  });

  const availabilityQ = useQuery({
    queryKey: ["booking", "availability", barberId, serviceId, date],
    queryFn: () =>
      getAvailability({
        data: { barberId, serviceId: serviceId!, date: date! },
      }),
    enabled: isOpen && !!serviceId && !!date && step === 3,
  });

  type CreateInput = {
    barberId: string;
    serviceId: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    email: string;
    notes: string | null;
  };
  const createMut = useMutation({
    mutationFn: (input: CreateInput) => createBooking({ data: input }),
    onSuccess: (res) => {
      setConfirmation({
        code: res.confirmationCode,
        startAt: res.startAt,
        barberName: res.barberName,
        serviceName: res.serviceName,
        priceCents: res.priceCents,
      });
      setStep(6);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Reset when overlay opens
  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setServiceId(initialServiceId);
    setBarberId(initialBarberId);
    setDate(null);
    setTime(null);
    setPickedBarberForSlot(null);
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setConfirmation(null);
  }, [isOpen, initialServiceId, initialBarberId]);

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const selectedService = useMemo(
    () => servicesQ.data?.find((s) => s.id === serviceId) ?? null,
    [servicesQ.data, serviceId],
  );
  const selectedBarber = useMemo(
    () => barbersQ.data?.find((b) => b.id === barberId) ?? null,
    [barbersQ.data, barberId],
  );

  const dateOptions = useMemo(() => {
    const arr: string[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      arr.push(ymd(d));
    }
    return arr;
  }, []);

  function canProceed(): boolean {
    switch (step) {
      case 0: return !!serviceId;
      case 1: return true; // barber optional (any)
      case 2: return !!date;
      case 3: return !!time;
      case 4:
        return (
          name.trim().length >= 2 &&
          phone.trim().length >= 6 &&
          /^\S+@\S+\.\S+$/.test(email.trim())
        );
      case 5: return true;
      default: return false;
    }
  }

  function next() {
    if (step === 5) {
      // Submit
      if (!serviceId || !date || !time) return;
      const effectiveBarberId = barberId ?? pickedBarberForSlot;
      if (!effectiveBarberId) return;
      createMut.mutate({
        barberId: effectiveBarberId,
        serviceId,
        date,
        time,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        notes: notes.trim() || null,
      });
      return;
    }
    setStep((s) => Math.min(s + 1, 6));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[100] bg-onyx text-ivory flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-white/8">
            <div className="container-luxe flex items-center justify-between py-5">
              <div>
                <div className="eyebrow text-muted-foreground">
                  Ραντεβού · Βήμα {Math.min(step + 1, 7)} από 7
                </div>
                <div className="font-display text-xl md:text-2xl mt-1 text-ivory">
                  {STEP_LABELS[step]}
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Κλείσιμο"
                className="text-ivory/70 hover:text-gold transition-colors"
              >
                <X className="h-6 w-6" strokeWidth={1.4} />
              </button>
            </div>
            {/* Progress bar */}
            <div className="container-luxe pb-4">
              <div className="flex gap-1.5">
                {STEP_LABELS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-[2px] flex-1 rounded-full transition-colors duration-500",
                      i <= step ? "bg-gold" : "bg-white/10",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="container-luxe py-10 md:py-16 max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {step === 0 && (
                    <StepService
                      services={servicesQ.data ?? []}
                      loading={servicesQ.isLoading}
                      selected={serviceId}
                      onSelect={(id) => {
                        setServiceId(id);
                        setTime(null);
                      }}
                    />
                  )}
                  {step === 1 && (
                    <StepBarber
                      barbers={barbersQ.data ?? []}
                      loading={barbersQ.isLoading}
                      selected={barberId}
                      onSelect={setBarberId}
                    />
                  )}
                  {step === 2 && (
                    <StepDate
                      dates={dateOptions}
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        setTime(null);
                      }}
                    />
                  )}
                  {step === 3 && (
                    <StepTime
                      loading={availabilityQ.isLoading}
                      slots={availabilityQ.data?.slots ?? []}
                      reason={availabilityQ.data?.reason ?? null}
                      selected={time}
                      onSelect={(t, bid) => {
                        setTime(t);
                        setPickedBarberForSlot(bid);
                      }}
                    />
                  )}
                  {step === 4 && (
                    <StepDetails
                      name={name}
                      phone={phone}
                      email={email}
                      notes={notes}
                      onName={setName}
                      onPhone={setPhone}
                      onEmail={setEmail}
                      onNotes={setNotes}
                    />
                  )}
                  {step === 5 && (
                    <StepReview
                      service={selectedService}
                      barber={
                        selectedBarber ??
                        (barbersQ.data ?? []).find((b) => b.id === pickedBarberForSlot) ??
                        null
                      }
                      date={date}
                      time={time}
                      name={name}
                      phone={phone}
                      email={email}
                      notes={notes}
                    />
                  )}
                  {step === 6 && confirmation && (
                    <StepConfirmation
                      confirmation={confirmation}
                      onClose={close}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer navigation */}
          {step < 6 && (
            <div className="border-t border-white/8 bg-onyx">
              <div className="container-luxe py-5 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className={cn(
                    "inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] transition-colors",
                    step === 0
                      ? "text-ivory/20 pointer-events-none"
                      : "text-ivory/70 hover:text-ivory",
                  )}
                >
                  <ChevronLeft className="h-4 w-4" /> Πίσω
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!canProceed() || createMut.isPending}
                  className={cn(
                    "inline-flex items-center gap-3 px-7 py-4 rounded-full text-[0.72rem] uppercase tracking-[0.24em] transition-all",
                    canProceed() && !createMut.isPending
                      ? "bg-ivory text-onyx hover:bg-gold"
                      : "bg-ivory/10 text-ivory/40 cursor-not-allowed",
                  )}
                >
                  {createMut.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Αποστολή
                    </>
                  ) : step === 5 ? (
                    <>Επιβεβαίωση ραντεβού <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>Συνέχεια <ChevronRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ---------- Steps ----------

function StepService({
  services,
  loading,
  selected,
  onSelect,
}: {
  services: PublicService[];
  loading: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const categories = useMemo(() => {
    const map = new Map<string, PublicService[]>();
    for (const s of services) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return [...map.entries()];
  }, [services]);
  if (loading) return <Spinner />;
  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground max-w-md">
        Επιλέξτε την υπηρεσία που επιθυμείτε. Οι τιμές είναι τελικές.
      </p>
      {categories.map(([cat, list]) => (
        <div key={cat}>
          <div className="eyebrow text-gold mb-4">{cat}</div>
          <div className="space-y-2">
            {list.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={cn(
                  "w-full text-left p-5 rounded-xl border transition-all group",
                  selected === s.id
                    ? "border-gold bg-gold/5"
                    : "border-white/10 hover:border-white/25 bg-white/[0.02]",
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="font-display text-xl text-ivory">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Διάρκεια · {s.duration_minutes} λεπτά
                    </div>
                  </div>
                  <div className="font-display text-2xl text-gold">
                    {formatEuro(s.price_cents)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepBarber({
  barbers,
  loading,
  selected,
  onSelect,
}: {
  barbers: PublicBarber[];
  loading: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  if (loading) return <Spinner />;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground max-w-md">
        Επιλέξτε τον barber που προτιμάτε — ή αφήστε το σε εμάς.
      </p>
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "w-full text-left p-5 rounded-xl border transition-all",
          selected === null
            ? "border-gold bg-gold/5"
            : "border-white/10 hover:border-white/25 bg-white/[0.02]",
        )}
      >
        <div className="font-display text-xl text-ivory">Οποιοσδήποτε διαθέσιμος</div>
        <div className="text-xs text-muted-foreground mt-1">
          Θα σας αναθέσουμε στον πρώτο διαθέσιμο.
        </div>
      </button>
      <div className="grid gap-3 md:grid-cols-2">
        {barbers.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b.id)}
            className={cn(
              "text-left p-5 rounded-xl border transition-all",
              selected === b.id
                ? "border-gold bg-gold/5"
                : "border-white/10 hover:border-white/25 bg-white/[0.02]",
            )}
          >
            <div className="font-display text-xl text-ivory">{b.name}</div>
            {b.role ? (
              <div className="text-xs text-muted-foreground mt-1">{b.role}</div>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepDate({
  dates,
  selected,
  onSelect,
}: {
  dates: string[];
  selected: string | null;
  onSelect: (d: string) => void;
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground max-w-md">
        Επιλέξτε ημερομηνία. Οι διαθέσιμες ώρες εμφανίζονται στο επόμενο βήμα.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {dates.map((d) => {
          const [y, m, day] = d.split("-").map(Number);
          const dt = new Date(y, m - 1, day);
          const isSelected = selected === d;
          return (
            <button
              key={d}
              onClick={() => onSelect(d)}
              className={cn(
                "p-4 rounded-xl border text-center transition-all",
                isSelected
                  ? "border-gold bg-gold/5 text-gold"
                  : "border-white/10 hover:border-white/25 bg-white/[0.02] text-ivory",
              )}
            >
              <div className="text-[0.65rem] uppercase tracking-[0.2em] opacity-60">
                {GREEK_WEEKDAYS[dt.getDay()]}
              </div>
              <div className="font-display text-2xl mt-1">{day}</div>
              <div className="text-[0.65rem] uppercase tracking-[0.2em] opacity-60 mt-1">
                {GREEK_MONTHS[m - 1]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepTime({
  loading,
  slots,
  reason,
  selected,
  onSelect,
}: {
  loading: boolean;
  slots: { time: string; barberId: string }[];
  reason: string | null;
  selected: string | null;
  onSelect: (t: string, barberId: string) => void;
}) {
  if (loading) return <Spinner />;
  if (!slots.length) {
    return (
      <div className="text-center py-12">
        <div className="font-display text-2xl text-ivory">
          {reason === "closed"
            ? "Είμαστε κλειστά αυτή την ημέρα."
            : reason === "beyond_horizon"
              ? "Πολύ μακριά στο μέλλον."
              : "Δεν υπάρχουν διαθέσιμες ώρες."}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Δοκιμάστε άλλη ημερομηνία ή άλλον barber.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground max-w-md">
        Επιλέξτε ώρα από τις παρακάτω διαθέσιμες.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {slots.map((s) => (
          <button
            key={s.time}
            onClick={() => onSelect(s.time, s.barberId)}
            className={cn(
              "py-4 rounded-xl border text-center font-display text-lg transition-all",
              selected === s.time
                ? "border-gold bg-gold/5 text-gold"
                : "border-white/10 hover:border-white/25 bg-white/[0.02] text-ivory",
            )}
          >
            {s.time}
          </button>
        ))}
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3 text-ivory placeholder:text-muted-foreground transition-colors";

function StepDetails({
  name, phone, email, notes,
  onName, onPhone, onEmail, onNotes,
}: {
  name: string; phone: string; email: string; notes: string;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onEmail: (v: string) => void;
  onNotes: (v: string) => void;
}) {
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground max-w-md">
        Χρειαζόμαστε λίγα στοιχεία για να επιβεβαιώσουμε το ραντεβού σας.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <Field label="Ονοματεπώνυμο">
          <input value={name} onChange={(e) => onName(e.target.value)} className={inputCls} autoComplete="name" />
        </Field>
        <Field label="Τηλέφωνο">
          <input value={phone} onChange={(e) => onPhone(e.target.value)} className={inputCls} autoComplete="tel" inputMode="tel" />
        </Field>
        <div className="md:col-span-2">
          <Field label="Email">
            <input value={email} onChange={(e) => onEmail(e.target.value)} className={inputCls} autoComplete="email" inputMode="email" />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Σημειώσεις (προαιρετικό)">
            <textarea value={notes} onChange={(e) => onNotes(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-3 text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function StepReview({
  service, barber, date, time, name, phone, email, notes,
}: {
  service: PublicService | null;
  barber: PublicBarber | null;
  date: string | null;
  time: string | null;
  name: string; phone: string; email: string; notes: string;
}) {
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground max-w-md">
        Ελέγξτε τα στοιχεία του ραντεβού σας πριν την επιβεβαίωση.
      </p>
      <div className="card-elegant p-8 space-y-5">
        <Row label="Υπηρεσία" value={service?.name ?? "—"} accent={service ? formatEuro(service.price_cents) : undefined} />
        <Row label="Διάρκεια" value={service ? `${service.duration_minutes} λεπτά` : "—"} />
        <Row label="Barber" value={barber?.name ?? "Οποιοσδήποτε"} />
        <Row label="Ημερομηνία" value={date ? formatDate(date) : "—"} />
        <Row label="Ώρα" value={time ?? "—"} />
        <div className="border-t border-white/8 pt-5 space-y-5">
          <Row label="Όνομα" value={name} />
          <Row label="Τηλέφωνο" value={phone} />
          <Row label="Email" value={email} />
          {notes ? <Row label="Σημειώσεις" value={notes} /> : null}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="eyebrow text-muted-foreground">{label}</div>
      <div className="text-right">
        <div className="text-ivory">{value}</div>
        {accent ? <div className="text-gold font-display text-lg">{accent}</div> : null}
      </div>
    </div>
  );
}

function StepConfirmation({
  confirmation,
  onClose,
}: {
  confirmation: {
    code: string;
    startAt: string;
    barberName: string;
    serviceName: string;
    priceCents: number;
  };
  onClose: () => void;
}) {
  const start = new Date(confirmation.startAt);
  const dateStr = start.toLocaleDateString("el-GR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Athens",
  });
  const timeStr = start.toLocaleTimeString("el-GR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Athens",
  });
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mx-auto w-20 h-20 rounded-full border border-gold flex items-center justify-center mb-8"
      >
        <Check className="h-8 w-8 text-gold" strokeWidth={1.4} />
      </motion.div>
      <div className="eyebrow text-gold mb-4">Επιβεβαιωμένο</div>
      <h2 className="font-display text-4xl md:text-5xl text-ivory">
        Σας περιμένουμε.
      </h2>
      <p className="mt-4 text-muted-foreground max-w-md mx-auto">
        Θα λάβετε email επιβεβαίωσης στη διεύθυνση που δηλώσατε. Για ακύρωση ή αλλαγή, καλέστε μας.
      </p>

      <div className="card-elegant max-w-md mx-auto mt-10 p-8 text-left space-y-4">
        <Row label="Κωδικός" value={confirmation.code} />
        <Row label="Υπηρεσία" value={confirmation.serviceName} accent={formatEuro(confirmation.priceCents)} />
        <Row label="Barber" value={confirmation.barberName} />
        <Row label="Ημερομηνία" value={dateStr} />
        <Row label="Ώρα" value={timeStr} />
      </div>

      <button
        onClick={onClose}
        className="mt-10 inline-flex items-center gap-3 px-7 py-4 rounded-full bg-ivory text-onyx text-[0.72rem] uppercase tracking-[0.24em] hover:bg-gold transition-colors"
      >
        Ολοκλήρωση
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-gold" />
    </div>
  );
}
