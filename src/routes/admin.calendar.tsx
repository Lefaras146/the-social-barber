import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAdminBookings } from "@/lib/admin.functions";
import { PageHeader, Card, Skeleton } from "@/components/admin/AdminUI";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/calendar")({ component: CalendarPage });

function CalendarPage() {
  const [view, setView] = useState<"week" | "month">("week");
  const [cursor, setCursor] = useState(new Date());
  const { data, isLoading } = useQuery({ queryKey: ["admin-bookings"], queryFn: () => getAdminBookings() });

  return (
    <div>
      <PageHeader
        title="Ημερολόγιο"
        action={
          <div className="flex gap-2 rounded-xl bg-white/[0.03] border border-white/10 p-1">
            {(["week", "month"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm transition ${view === v ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}>
                {v === "week" ? "Εβδομάδα" : "Μήνας"}
              </button>
            ))}
          </div>
        }
      />

      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg text-white capitalize">
            {cursor.toLocaleDateString("el-GR", view === "week" ? { day: "numeric", month: "long", year: "numeric" } : { month: "long", year: "numeric" })}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCursor(shift(cursor, view, -1))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"><ChevronLeft size={16} /></button>
            <button onClick={() => setCursor(new Date())} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wide">Σήμερα</button>
            <button onClick={() => setCursor(shift(cursor, view, 1))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"><ChevronRight size={16} /></button>
          </div>
        </div>

        {isLoading ? <Skeleton className="h-96" /> : view === "week" ? <WeekView cursor={cursor} bookings={data ?? []} /> : <MonthView cursor={cursor} bookings={data ?? []} />}
      </Card>
    </div>
  );
}

function shift(d: Date, view: "week" | "month", delta: number) {
  const n = new Date(d);
  if (view === "week") n.setDate(n.getDate() + delta * 7);
  else n.setMonth(n.getMonth() + delta);
  return n;
}

function startOfWeek(d: Date) {
  const n = new Date(d); n.setHours(0, 0, 0, 0);
  n.setDate(n.getDate() - ((n.getDay() + 6) % 7));
  return n;
}

function WeekView({ cursor, bookings }: { cursor: Date; bookings: any[] }) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }).map((_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  const dayNames = ["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"];
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {days.map((day, i) => {
        const dayBookings = bookings.filter((b) => sameDay(new Date(b.start_at), day)).sort((a, b) => +new Date(a.start_at) - +new Date(b.start_at));
        return (
          <div key={i} className="min-h-[220px] rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="flex justify-between items-baseline mb-3">
              <div className="text-xs uppercase tracking-wide text-zinc-500">{dayNames[i]}</div>
              <div className={`text-sm ${sameDay(day, new Date()) ? "text-amber-400" : "text-white"}`}>{day.getDate()}</div>
            </div>
            <div className="space-y-2">
              {dayBookings.length === 0 && <div className="text-xs text-zinc-600 text-center pt-6">—</div>}
              {dayBookings.map((b) => (
                <div key={b.id} className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-xs">
                  <div className="text-white truncate">{b.customer_name}</div>
                  <div className="text-zinc-500 truncate mt-0.5">
                    {new Date(b.start_at).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" })} · {b.services?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MonthView({ cursor, bookings }: { cursor: Date; bookings: any[] }) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startOff = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOff; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"].map((d) => (
          <div key={d} className="text-xs text-zinc-500 uppercase tracking-wide text-center py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dayBookings = bookings.filter((b) => sameDay(new Date(b.start_at), day));
          const today = sameDay(day, new Date());
          return (
            <div key={i} className={`min-h-[100px] rounded-xl border p-2 ${today ? "border-amber-500/40 bg-amber-500/[0.03]" : "border-white/10 bg-white/[0.02]"}`}>
              <div className={`text-xs ${today ? "text-amber-400" : "text-zinc-400"}`}>{day.getDate()}</div>
              <div className="mt-1 space-y-1">
                {dayBookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="text-[10px] text-white bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 truncate">
                    {new Date(b.start_at).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" })} {b.customer_name}
                  </div>
                ))}
                {dayBookings.length > 3 && <div className="text-[10px] text-zinc-500">+{dayBookings.length - 3}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
