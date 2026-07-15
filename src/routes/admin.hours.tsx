import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listBusinessHours, upsertBusinessHour, listTimeOff, createTimeOff, deleteTimeOff, listAdminBarbers } from "@/lib/admin.functions";
import { PageHeader, Card, Skeleton, formatDate } from "@/components/admin/AdminUI";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/hours")({ component: HoursPage });

const dayNames = ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"];

function HoursPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Ώρες Λειτουργίας & Διακοπές" />
      <BusinessHoursSection />
      <TimeOffSection />
    </div>
  );
}

function BusinessHoursSection() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-hours"], queryFn: () => listBusinessHours() });
  const mut = useMutation({
    mutationFn: (v: any) => upsertBusinessHour({ data: v }),
    onSuccess: () => { toast.success("Αποθηκεύτηκε"); qc.invalidateQueries({ queryKey: ["admin-hours"] }); },
    onError: () => toast.error("Σφάλμα"),
  });

  return (
    <Card>
      <h2 className="text-lg text-white mb-6">Ωράριο</h2>
      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 0].map((dow) => {
            const row = (data ?? []).find((h: any) => h.day_of_week === dow) ?? { day_of_week: dow, open_time: "09:00", close_time: "21:00", closed: true };
            return <HourRow key={dow} row={row} onSave={(v) => mut.mutate(v)} />;
          })}
        </div>
      )}
    </Card>
  );
}

function HourRow({ row, onSave }: any) {
  const [open, setOpen] = useState(row.open_time?.slice(0, 5) ?? "09:00");
  const [close, setClose] = useState(row.close_time?.slice(0, 5) ?? "21:00");
  const [closed, setClosed] = useState(row.closed);
  const input = "px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/40";
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="w-28 text-sm text-white">{dayNames[row.day_of_week]}</div>
      <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
        <input type="checkbox" checked={closed} onChange={(e) => setClosed(e.target.checked)} className="w-4 h-4" /> Κλειστό
      </label>
      {!closed && (
        <>
          <input type="time" value={open} onChange={(e) => setOpen(e.target.value)} className={input} />
          <span className="text-zinc-500">—</span>
          <input type="time" value={close} onChange={(e) => setClose(e.target.value)} className={input} />
        </>
      )}
      <button onClick={() => onSave({ day_of_week: row.day_of_week, open_time: closed ? null : open, close_time: closed ? null : close, closed })} className="ml-auto px-4 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-amber-400 transition">
        Αποθήκευση
      </button>
    </div>
  );
}

function TimeOffSection() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-timeoff"], queryFn: () => listTimeOff() });
  const barbers = useQuery({ queryKey: ["admin-barbers"], queryFn: () => listAdminBarbers() });
  const [showNew, setShowNew] = useState(false);
  const del = useMutation({
    mutationFn: (id: string) => deleteTimeOff({ data: { id } }),
    onSuccess: () => { toast.success("Διαγράφηκε"); qc.invalidateQueries({ queryKey: ["admin-timeoff"] }); },
  });

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg text-white">Αργίες · Άδειες · Μπλοκαρισμένες ώρες</h2>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-amber-400 transition">
          <Plus size={14} /> Νέα
        </button>
      </div>
      {isLoading ? <Skeleton className="h-40" /> : (data ?? []).length === 0 ? (
        <div className="text-zinc-500 text-sm text-center py-8">Καμία εγγραφή</div>
      ) : (
        <div className="space-y-2">
          {(data ?? []).map((t: any) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <div className="text-sm text-white">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-amber-500/10 text-amber-300 mr-2">{t.kind}</span>
                  {t.reason || "—"}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {formatDate(t.starts_at)} → {formatDate(t.ends_at)} · {t.barbers?.name ?? "Όλοι"}
                </div>
              </div>
              <button onClick={() => { if (confirm("Διαγραφή;")) del.mutate(t.id); }} className="p-2 rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white text-red-300"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
      {showNew && <NewTimeOff barbers={barbers.data ?? []} onClose={() => setShowNew(false)} onDone={() => { setShowNew(false); qc.invalidateQueries({ queryKey: ["admin-timeoff"] }); }} />}
    </Card>
  );
}

function NewTimeOff({ barbers, onClose, onDone }: any) {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const toLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const [f, setF] = useState({
    kind: "blocked" as "holiday" | "vacation" | "blocked",
    barber_id: "", reason: "",
    starts_at: toLocal(now),
    ends_at: toLocal(new Date(now.getTime() + 3600000)),
  });
  const mut = useMutation({
    mutationFn: () => createTimeOff({ data: {
      kind: f.kind, barber_id: f.barber_id || null, reason: f.reason || null,
      starts_at: new Date(f.starts_at).toISOString(), ends_at: new Date(f.ends_at).toISOString(),
    }}),
    onSuccess: () => { toast.success("Δημιουργήθηκε"); onDone(); },
    onError: (e: any) => toast.error(e.message ?? "Σφάλμα"),
  });
  const input = "w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/40";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-8 space-y-4">
        <h2 className="text-xl font-light text-white mb-2">Νέα διακοπή</h2>
        <select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as any })} className={input}>
          <option value="blocked">Μπλοκαρισμένες ώρες</option>
          <option value="holiday">Αργία</option>
          <option value="vacation">Άδεια</option>
        </select>
        <select value={f.barber_id} onChange={(e) => setF({ ...f, barber_id: e.target.value })} className={input}>
          <option value="">Όλοι οι κουρείς</option>
          {barbers.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input placeholder="Αιτία (προαιρετικό)" value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} className={input} />
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-xs text-zinc-500">Από</span>
            <input required type="datetime-local" value={f.starts_at} onChange={(e) => setF({ ...f, starts_at: e.target.value })} className={input + " mt-1"} /></label>
          <label className="block"><span className="text-xs text-zinc-500">Έως</span>
            <input required type="datetime-local" value={f.ends_at} onChange={(e) => setF({ ...f, ends_at: e.target.value })} className={input + " mt-1"} /></label>
        </div>
        <button type="submit" disabled={mut.isPending} className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-amber-400 transition disabled:opacity-50">
          Αποθήκευση
        </button>
      </form>
    </div>
  );
}
