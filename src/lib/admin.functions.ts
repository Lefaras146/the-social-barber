import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Guard helper - verify admin role via has_role
async function ensureAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

// ============ BOOKINGS ============
export const getAdminBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("bookings")
      .select(
        `id, customer_name, customer_phone, customer_email, notes, start_at, end_at, status, created_at,
         services(id, name, price_cents, duration_minutes),
         barbers(id, name)`,
      )
      .order("start_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["pending", "confirmed", "cancelled", "completed", "no_show"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("bookings").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

export const rescheduleBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      start_at: z.string(),
      end_at: z.string(),
      barber_id: z.string().uuid().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const patch: any = { start_at: data.start_at, end_at: data.end_at };
    if (data.barber_id) patch.barber_id = data.barber_id;
    const { error } = await context.supabase.from("bookings").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

export const updateBookingNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), notes: z.string().max(2000) }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("bookings").update({ notes: data.notes }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

export const deleteBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("bookings").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

export const createManualBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      customer_name: z.string().min(1),
      customer_phone: z.string().min(1),
      customer_email: z.string().email().optional().or(z.literal("")),
      notes: z.string().optional(),
      barber_id: z.string().uuid(),
      service_id: z.string().uuid(),
      start_at: z.string(),
      end_at: z.string(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("bookings").insert({
      ...data,
      customer_email: data.customer_email || null,
      status: "confirmed",
    } as any);
    if (error) throw new Error(error.message);
    return true;
  });

// ============ STATS ============
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay); endOfDay.setDate(endOfDay.getDate() + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(startOfDay); startOfWeek.setDate(startOfWeek.getDate() - ((startOfDay.getDay() + 6) % 7));
    const last30 = new Date(now); last30.setDate(last30.getDate() - 29);

    const [{ data: allRows }, { count: total }] = await Promise.all([
      context.supabase
        .from("bookings")
        .select("start_at, status, services(price_cents), customer_phone")
        .gte("start_at", last30.toISOString()),
      context.supabase.from("bookings").select("id", { count: "exact", head: true }),
    ]);

    const rows = (allRows ?? []) as any[];
    const revenueOf = (r: any) => (r.services?.price_cents ?? 0);
    const isRevenue = (r: any) => ["confirmed", "completed"].includes(r.status);

    let todayCount = 0, weekRevenue = 0, monthRevenue = 0, weekCount = 0, monthCount = 0;
    const uniqueCustomers = new Set<string>();
    const dailyMap = new Map<string, { count: number; revenue: number }>();
    for (let i = 0; i < 30; i++) {
      const d = new Date(last30); d.setDate(d.getDate() + i);
      dailyMap.set(d.toISOString().slice(0, 10), { count: 0, revenue: 0 });
    }
    for (const r of rows) {
      const t = new Date(r.start_at);
      const dayKey = t.toISOString().slice(0, 10);
      const entry = dailyMap.get(dayKey);
      if (entry) { entry.count++; if (isRevenue(r)) entry.revenue += revenueOf(r); }
      if (t >= startOfDay && t < endOfDay) todayCount++;
      if (t >= startOfWeek && isRevenue(r)) { weekRevenue += revenueOf(r); weekCount++; }
      if (t >= startOfMonth && isRevenue(r)) { monthRevenue += revenueOf(r); monthCount++; }
      if (r.customer_phone) uniqueCustomers.add(r.customer_phone);
    }

    return {
      today: todayCount,
      weekBookings: weekCount,
      monthBookings: monthCount,
      weekRevenueCents: weekRevenue,
      monthRevenueCents: monthRevenue,
      totalBookings: total ?? 0,
      uniqueCustomers: uniqueCustomers.size,
      daily: [...dailyMap.entries()].map(([date, v]) => ({ date, ...v })),
    };
  });

// ============ CUSTOMERS ============
export const getAdminCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("bookings")
      .select("customer_name, customer_phone, customer_email, start_at, status, services(price_cents, name)")
      .order("start_at", { ascending: false });
    if (error) throw new Error(error.message);
    const map = new Map<string, any>();
    for (const r of (data ?? []) as any[]) {
      const key = r.customer_phone;
      if (!key) continue;
      const revenue = ["confirmed", "completed"].includes(r.status) ? (r.services?.price_cents ?? 0) : 0;
      const existing = map.get(key);
      if (existing) {
        existing.visits += 1;
        existing.revenueCents += revenue;
        existing.history.push(r);
        if (new Date(r.start_at) > new Date(existing.lastVisit)) existing.lastVisit = r.start_at;
      } else {
        map.set(key, {
          name: r.customer_name, phone: key, email: r.customer_email,
          visits: 1, revenueCents: revenue, lastVisit: r.start_at, history: [r],
        });
      }
    }
    return [...map.values()].sort((a, b) => +new Date(b.lastVisit) - +new Date(a.lastVisit));
  });

// ============ SERVICES CRUD ============
export const listAdminServices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase.from("services").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  price_cents: z.number().int().nonnegative(),
  duration_minutes: z.number().int().positive(),
  sort_order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const upsertService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => serviceSchema.parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("services").upsert(data);
    if (error) throw new Error(error.message);
    return true;
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

// ============ BARBERS CRUD ============
export const listAdminBarbers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase.from("barbers").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const barberSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  role: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const upsertBarber = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => barberSchema.parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("barbers").upsert(data);
    if (error) throw new Error(error.message);
    return true;
  });

export const deleteBarber = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("barbers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

// ============ BUSINESS HOURS ============
export const listBusinessHours = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase.from("business_hours").select("*").order("day_of_week");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertBusinessHour = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      day_of_week: z.number().int().min(0).max(6),
      open_time: z.string().nullable(),
      close_time: z.string().nullable(),
      closed: z.boolean(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("business_hours").upsert(data, { onConflict: "day_of_week" });
    if (error) throw new Error(error.message);
    return true;
  });

// ============ TIME OFF (holidays / vacations / blocked) ============
export const listTimeOff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("time_off")
      .select("*, barbers(name)")
      .order("starts_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createTimeOff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      barber_id: z.string().uuid().nullable(),
      starts_at: z.string(),
      ends_at: z.string(),
      reason: z.string().nullable().optional(),
      kind: z.enum(["holiday", "vacation", "blocked"]).default("blocked"),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("time_off").insert(data);
    if (error) throw new Error(error.message);
    return true;
  });

export const deleteTimeOff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("time_off").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });
