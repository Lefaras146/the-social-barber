import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

// ---------- server-only public client ----------
function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

// ---------- Types ----------
export type PublicBarber = {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  bio: string | null;
  sort_order: number;
};

export type PublicService = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price_cents: number;
  duration_minutes: number;
  sort_order: number;
};

// ---------- List barbers ----------
export const listBarbersFn = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("barbers")
    .select("id, slug, name, role, bio, sort_order")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as PublicBarber[];
});

// ---------- List services ----------
export const listServicesFn = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("services")
    .select("id, slug, name, category, price_cents, duration_minutes, sort_order")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as PublicService[];
});

// ---------- Availability ----------
const availabilityInput = z.object({
  barberId: z.string().uuid().nullable(),
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD in Europe/Athens
});

export type Slot = { time: string; barberId: string }; // time HH:mm, barber that can take it

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function fromMinutes(m: number) {
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

// Build a timestamptz from a date + minutes-of-day using Europe/Athens.
// Uses an offset lookup by probing Intl for that date.
function athensOffsetMinutes(dateYmd: string): number {
  // Compute offset by asking Intl what UTC time corresponds to noon local.
  const [y, m, d] = dateYmd.split("-").map(Number);
  const utcProbe = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dtf = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(utcProbe);
  const hh = Number(parts.find((p) => p.type === "hour")?.value ?? 12);
  const mm = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  // local - utc offset (minutes)
  return (hh * 60 + mm) - (12 * 60);
}

function localToUtc(dateYmd: string, minuteOfDay: number): Date {
  const [y, m, d] = dateYmd.split("-").map(Number);
  const off = athensOffsetMinutes(dateYmd);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) + (minuteOfDay - off) * 60000);
}

export const getAvailabilityFn = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => availabilityInput.parse(i))
  .handler(async ({ data }) => {
    const sb = publicClient();

    // Load service
    const { data: svc, error: svcErr } = await sb
      .from("services")
      .select("id, duration_minutes, active")
      .eq("id", data.serviceId)
      .maybeSingle();
    if (svcErr) throw new Error(svcErr.message);
    if (!svc || !svc.active) throw new Error("Η υπηρεσία δεν είναι διαθέσιμη");
    const duration = svc.duration_minutes;

    // Load settings
    const { data: settings } = await sb
      .from("booking_settings")
      .select("min_notice_minutes, buffer_minutes, slot_step_minutes, horizon_days")
      .eq("id", true)
      .maybeSingle();
    const minNotice = settings?.min_notice_minutes ?? 60;
    const buffer = settings?.buffer_minutes ?? 5;
    const step = settings?.slot_step_minutes ?? 15;
    const horizon = settings?.horizon_days ?? 60;

    // Check horizon
    const today = new Date();
    const targetStart = localToUtc(data.date, 0);
    const daysAhead = Math.floor((targetStart.getTime() - today.getTime()) / 86400000);
    if (daysAhead > horizon) return { slots: [] as Slot[], reason: "beyond_horizon" as const };

    // Load barbers
    const barbersQ = sb.from("barbers").select("id, slug, name").eq("active", true);
    if (data.barberId) barbersQ.eq("id", data.barberId);
    const { data: barbers, error: barbersErr } = await barbersQ;
    if (barbersErr) throw new Error(barbersErr.message);
    if (!barbers?.length) return { slots: [], reason: "no_barber" as const };

    // Compute day-of-week (0=Sun..6=Sat) in Athens for this date
    const [y, m, d] = data.date.split("-").map(Number);
    const dow = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay(); // stable regardless of TZ

    // Business hours
    const { data: bh } = await sb
      .from("business_hours")
      .select("open_time, close_time, closed")
      .eq("day_of_week", dow)
      .maybeSingle();
    if (!bh || bh.closed || !bh.open_time || !bh.close_time) {
      return { slots: [], reason: "closed" as const };
    }
    const shopOpen = toMinutes(bh.open_time);
    const shopClose = toMinutes(bh.close_time);

    // Per-barber schedules
    const { data: schedules } = await sb
      .from("barber_schedules")
      .select("barber_id, start_time, end_time")
      .eq("day_of_week", dow)
      .eq("active", true)
      .in(
        "barber_id",
        barbers.map((b) => b.id),
      );
    const scheduleByBarber = new Map<string, { start: number; end: number }>();
    for (const s of schedules ?? []) {
      scheduleByBarber.set(s.barber_id, {
        start: toMinutes(s.start_time),
        end: toMinutes(s.end_time),
      });
    }

    // Breaks
    const { data: breaks } = await sb
      .from("barber_breaks")
      .select("barber_id, start_time, end_time")
      .eq("day_of_week", dow)
      .in(
        "barber_id",
        barbers.map((b) => b.id),
      );
    const breaksByBarber = new Map<string, Array<{ start: number; end: number }>>();
    for (const b of breaks ?? []) {
      const arr = breaksByBarber.get(b.barber_id) ?? [];
      arr.push({ start: toMinutes(b.start_time), end: toMinutes(b.end_time) });
      breaksByBarber.set(b.barber_id, arr);
    }

    // Day range in UTC
    const dayStart = localToUtc(data.date, 0).toISOString();
    const dayEnd = localToUtc(data.date, 24 * 60).toISOString();

    // Time off overlapping this day
    const { data: timeOff } = await sb
      .from("time_off")
      .select("barber_id, starts_at, ends_at")
      .lt("starts_at", dayEnd)
      .gt("ends_at", dayStart);

    // Bookings for these barbers on this day (pending/confirmed)
    const { data: bookings } = await sb
      .from("public_booking_availability")
      .select("barber_id, start_at, end_at, status")
      .in("status", ["pending", "confirmed"])
      .in(
        "barber_id",
        barbers.map((b) => b.id),
      )
      .lt("start_at", dayEnd)
      .gt("end_at", dayStart);
    console.log("BOOKINGS FOUND", bookings);
    const nowMs = Date.now();

    // Compute slots per barber, then union (keep earliest-listed barber per time)
    const slotMap = new Map<string, string>(); // time -> barberId
    for (const barber of barbers) {
      const win = scheduleByBarber.get(barber.id) ?? { start: shopOpen, end: shopClose };
      // intersect with shop hours
      const winStart = Math.max(win.start, shopOpen);
      const winEnd = Math.min(win.end, shopClose);
      if (winStart >= winEnd) continue;

      const brks = breaksByBarber.get(barber.id) ?? [];
      const barberOff = (timeOff ?? []).filter(
        (t) => !t.barber_id || t.barber_id === barber.id,
      );
      const barberBookings = (bookings ?? []).filter((b) => b.barber_id === barber.id);

      for (let t = winStart; t + duration <= winEnd; t += step) {
        const slotStartUtc = localToUtc(data.date, t);
        const slotEndUtc = localToUtc(data.date, t + duration);
        // Enforce min notice
        if (slotStartUtc.getTime() - nowMs < minNotice * 60000) continue;
        // Break overlap
        const overlapsBreak = brks.some((b) => t < b.end && t + duration > b.start);
        if (overlapsBreak) continue;
        // Time off overlap
        const overlapsOff = barberOff.some(
          (o) =>
            new Date(o.starts_at).getTime() < slotEndUtc.getTime() &&
            new Date(o.ends_at).getTime() > slotStartUtc.getTime(),
        );
        if (overlapsOff) continue;
        // Booking overlap (with buffer on both sides)
        const overlapsBooking = barberBookings.some((bk) => {
          const bs = new Date(bk.start_at).getTime() - buffer * 60000;
          const be = new Date(bk.end_at).getTime() + buffer * 60000;
          return bs < slotEndUtc.getTime() && be > slotStartUtc.getTime();
        });
        if (overlapsBooking) continue;

        const label = fromMinutes(t);
        if (!slotMap.has(label)) slotMap.set(label, barber.id);
      }
    }

    const slots: Slot[] = [...slotMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, barberId]) => ({ time, barberId }));

    return { slots, reason: null };
  });

// ---------- Create booking ----------
const createInput = z.object({
  barberId: z.string().uuid(),
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(200),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const createBookingFn = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => createInput.parse(i))
  .handler(async ({ data }) => {
    // Use admin client for the insert (bypasses RLS gates for the read-back) — the insert itself is public.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Load service + barber
    const [{ data: svc, error: svcErr }, { data: barber, error: bErr }] = await Promise.all([
      supabaseAdmin
        .from("services")
        .select("id, name, price_cents, duration_minutes, active")
        .eq("id", data.serviceId)
        .maybeSingle(),
      supabaseAdmin
        .from("barbers")
        .select("id, name, active")
        .eq("id", data.barberId)
        .maybeSingle(),
    ]);
    if (svcErr) throw new Error(svcErr.message);
    if (bErr) throw new Error(bErr.message);
    if (!svc?.active) throw new Error("Η υπηρεσία δεν είναι διαθέσιμη");
    if (!barber?.active) throw new Error("Ο barber δεν είναι διαθέσιμος");

    const minute = toMinutes(data.time);
    const startAt = localToUtc(data.date, minute);
    const endAt = new Date(startAt.getTime() + svc.duration_minutes * 60000);

    const { data: inserted, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        barber_id: data.barberId,
        service_id: data.serviceId,
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: data.email,
        notes: data.notes ?? null,
        start_at: startAt.toISOString(),
        end_at: endAt.toISOString(),
        price_cents_at_booking: svc.price_cents,
        duration_minutes_at_booking: svc.duration_minutes,
        status: "confirmed",
      })
      .select("id, confirmation_code, start_at, end_at")
      .single();

    if (error) {
      if (error.message.toLowerCase().includes("overlap") || error.code === "23P01") {
        throw new Error("Αυτή η ώρα μόλις κλείστηκε. Δοκιμάστε άλλη.");
      }
      throw new Error(error.message);
    }

    return {
      id: inserted.id,
      confirmationCode: inserted.confirmation_code,
      startAt: inserted.start_at,
      endAt: inserted.end_at,
      barberName: barber.name,
      serviceName: svc.name,
      priceCents: svc.price_cents,
    };
  });

export const getAdminBookings = createServerFn({ method: "GET" })
.handler(async () => {

  const sb = publicClient();

  const { data, error } = await sb
    .from("bookings")
    .select("*")
    .limit(10);


  console.log("ADMIN BOOKINGS DATA:", data);
  console.log("ADMIN BOOKINGS ERROR:", error);


  if (error) {
    throw new Error(error.message);
  }


  return data ?? [];

});