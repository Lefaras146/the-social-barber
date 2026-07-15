import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminStats, getAdminBookings } from "@/lib/admin.functions";
import { PageHeader, Card, StatCard, Skeleton, formatEuro, formatDate } from "@/components/admin/AdminUI";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { Clock3, Scissors, User } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const stats = useQuery({ queryKey: ["admin-stats"], queryFn: () => getAdminStats() });
  const bookings = useQuery({ queryKey: ["admin-bookings"], queryFn: () => getAdminBookings() });

  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay); endOfDay.setDate(endOfDay.getDate() + 1);
  const nextWeek = new Date(endOfDay); nextWeek.setDate(nextWeek.getDate() + 7);

  const today = (bookings.data ?? []).filter((b: any) => {
    const t = new Date(b.start_at); return t >= startOfDay && t < endOfDay;
  });
  const upcoming = (bookings.data ?? []).filter((b: any) => {
    const t = new Date(b.start_at); return t >= endOfDay && t < nextWeek;
  }).slice(0, 6);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Επισκόπηση της ημέρας" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <StatCard label="Σήμερα" value={stats.data?.today ?? 0} hint="ραντεβού" />
            <StatCard label="Εβδομάδα" value={stats.data?.weekBookings ?? 0} hint={formatEuro(stats.data?.weekRevenueCents ?? 0)} />
            <StatCard label="Μήνας" value={stats.data?.monthBookings ?? 0} hint={formatEuro(stats.data?.monthRevenueCents ?? 0)} />
            <StatCard label="Πελάτες" value={stats.data?.uniqueCustomers ?? 0} hint="μοναδικοί" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <div className="flex justify-between items-baseline mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Έσοδα</div>
              <div className="text-xl text-white mt-1">Τελευταίες 30 ημέρες</div>
            </div>
          </div>
          {stats.isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.data?.daily ?? []}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickFormatter={(v) => v.slice(5)} />
                  <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `€${(v / 100).toFixed(0)}`} />
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} formatter={(v: any) => formatEuro(v as number)} />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-1">Κρατήσεις</div>
          <div className="text-xl text-white mb-6">Ανά ημέρα</div>
          {stats.isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.data?.daily ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickFormatter={(v) => v.slice(8)} />
                  <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                  <Bar dataKey="count" fill="rgba(245,158,11,0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <Card>
          <div className="flex items-baseline justify-between mb-5">
            <div className="text-xl text-white">Σήμερα</div>
            <div className="text-xs text-zinc-500">{today.length} ραντεβού</div>
          </div>
          {bookings.isLoading ? <Skeleton className="h-40" /> : today.length === 0 ? (
            <div className="text-zinc-500 text-sm py-8 text-center">Κανένα ραντεβού σήμερα</div>
          ) : (
            <div className="space-y-3">
              {today.map((b: any) => <BookingRow key={b.id} b={b} />)}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-baseline justify-between mb-5">
            <div className="text-xl text-white">Επόμενα</div>
            <div className="text-xs text-zinc-500">επόμενες 7 ημέρες</div>
          </div>
          {bookings.isLoading ? <Skeleton className="h-40" /> : upcoming.length === 0 ? (
            <div className="text-zinc-500 text-sm py-8 text-center">Καμία επικείμενη κράτηση</div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b: any) => <BookingRow key={b.id} b={b} showDate />)}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function BookingRow({ b, showDate }: { b: any; showDate?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs shrink-0">
          <User size={14} />
        </div>
        <div className="min-w-0">
          <div className="text-white text-sm truncate">{b.customer_name}</div>
          <div className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5 truncate">
            <Scissors size={11} /> {b.services?.name} · {b.barbers?.name}
          </div>
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <div className="text-white text-sm flex items-center gap-1.5 justify-end">
          <Clock3 size={12} className="text-zinc-500" />
          {formatDate(b.start_at, showDate ? { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" } : { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
