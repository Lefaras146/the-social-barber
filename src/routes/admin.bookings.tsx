import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getAdminBookings, updateBookingStatus, deleteBooking, updateBookingNotes, rescheduleBooking, createManualBooking, listAdminBarbers, listAdminServices } from "@/lib/admin.functions";
import { PageHeader, Card, Skeleton, EmptyState, formatDate, formatEuro } from "@/components/admin/AdminUI";
import { Check, X, Trash2, Clock3, Phone, Scissors, User, Mail, Search, Plus, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/bookings")({ component: BookingsPage });

const statusStyle: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-300 border-red-500/20",
  completed: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  no_show: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
};

function BookingsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const { data, isLoading, error } = useQuery({ queryKey: ["admin-bookings"], queryFn: () => getAdminBookings() });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const statusMut = useMutation({
    mutationFn: (v: { id: string; status: any }) => updateBookingStatus({ data: v }),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: ["admin-bookings"] });
      const prev = qc.getQueryData<any[]>(["admin-bookings"]);
      qc.setQueryData<any[]>(["admin-bookings"], (old) => (old ?? []).map((b) => (b.id === v.id ? { ...b, status: v.status } : b)));
      return { prev };
    },
    onError: (_e, _v, ctx) => { qc.setQueryData(["admin-bookings"], ctx?.prev); toast.error("Αποτυχία ενημέρωσης"); },
    onSuccess: () => { toast.success("Ενημερώθηκε"); invalidate(); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteBooking({ data: { id } }),
    onSuccess: () => { toast.success("Διαγράφηκε"); invalidate(); },
    onError: () => toast.error("Αποτυχία διαγραφής"),
  });

  const filtered = (data ?? []).filter((b: any) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.customer_name?.toLowerCase().includes(q) ||
        b.customer_phone?.includes(q) ||
        b.customer_email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Ραντεβού"
        subtitle={`${filtered.length} ραντεβού`}
        action={
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-amber-400 transition">
            <Plus size={16} /> Νέο Ραντεβού
          </button>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Αναζήτηση πελάτη, τηλέφωνο, email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/40"
          >
            <option value="all">Όλα</option>
            <option value="pending">Εκκρεμή</option>
            <option value="confirmed">Επιβεβαιωμένα</option>
            <option value="completed">Ολοκληρωμένα</option>
            <option value="cancelled">Ακυρωμένα</option>
            <option value="no_show">No-show</option>
          </select>
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : error ? (
        <Card><div className="text-red-400 text-sm">Σφάλμα φόρτωσης</div></Card>
      ) : filtered.length === 0 ? (
        <EmptyState title="Κανένα ραντεβού" hint="Δοκιμάστε άλλα φίλτρα" />
      ) : (
        <div className="space-y-3">
          {filtered.map((b: any) => (
            <Card key={b.id} className="hover:border-amber-500/30 transition">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <User size={17} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-lg font-light">{b.customer_name}</div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5"><Clock3 size={12} /> {formatDate(b.start_at)}</span>
                      <span className="flex items-center gap-1.5"><Scissors size={12} /> {b.services?.name} · {formatEuro(b.services?.price_cents ?? 0)}</span>
                      <span className="flex items-center gap-1.5"><User size={12} /> {b.barbers?.name}</span>
                      <span className="flex items-center gap-1.5"><Phone size={12} /> {b.customer_phone}</span>
                      {b.customer_email && <span className="flex items-center gap-1.5"><Mail size={12} /> {b.customer_email}</span>}
                    </div>
                    {b.notes && <div className="mt-2 text-xs text-zinc-500 italic">"{b.notes}"</div>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] border ${statusStyle[b.status] ?? statusStyle.pending}`}>
                    {b.status}
                  </span>
                  <div className="flex gap-1.5">
                    {b.status !== "confirmed" && (
                      <IconBtn onClick={() => statusMut.mutate({ id: b.id, status: "confirmed" })} tone="emerald" title="Επιβεβαίωση"><Check size={14} /></IconBtn>
                    )}
                    {b.status !== "cancelled" && (
                      <IconBtn onClick={() => statusMut.mutate({ id: b.id, status: "cancelled" })} tone="red" title="Ακύρωση"><X size={14} /></IconBtn>
                    )}
                    <IconBtn onClick={() => setEditing(b)} tone="zinc" title="Επεξεργασία"><Pencil size={14} /></IconBtn>
                    <IconBtn onClick={() => { if (confirm("Διαγραφή;")) deleteMut.mutate(b.id); }} tone="red" title="Διαγραφή"><Trash2 size={14} /></IconBtn>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showNew && <NewBookingDialog onClose={() => setShowNew(false)} onDone={() => { setShowNew(false); invalidate(); }} />}
      {editing && <EditBookingDialog booking={editing} onClose={() => setEditing(null)} onDone={() => { setEditing(null); invalidate(); }} />}
    </div>
  );
}

function IconBtn({ children, onClick, tone, title }: any) {
  const tones: Record<string, string> = {
    emerald: "border-emerald-500/30 hover:bg-emerald-500 hover:text-black text-emerald-300",
    red: "border-red-500/30 hover:bg-red-500 hover:text-white text-red-300",
    zinc: "border-white/10 hover:bg-white/10 text-zinc-300",
  };
  return (
    <button onClick={onClick} title={title} className={`p-2 rounded-lg border transition ${tones[tone]}`}>
      {children}
    </button>
  );
}

function DialogShell({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function fieldClass() { return "w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/40"; }

function toLocalInput(d: Date) {
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function NewBookingDialog({ onClose, onDone }: any) {
  const barbers = useQuery({ queryKey: ["admin-barbers"], queryFn: () => listAdminBarbers() });
  const services = useQuery({ queryKey: ["admin-services"], queryFn: () => listAdminServices() });
  const [form, setForm] = useState({
    customer_name: "", customer_phone: "", customer_email: "", notes: "",
    barber_id: "", service_id: "", start: toLocalInput(new Date(Date.now() + 3600000)),
  });
  const mut = useMutation({
    mutationFn: async () => {
      const svc = (services.data ?? []).find((s: any) => s.id === form.service_id);
      const start = new Date(form.start);
      const end = new Date(start.getTime() + (svc?.duration_minutes ?? 30) * 60000);
      return createManualBooking({ data: {
        customer_name: form.customer_name, customer_phone: form.customer_phone,
        customer_email: form.customer_email, notes: form.notes,
        barber_id: form.barber_id, service_id: form.service_id,
        start_at: start.toISOString(), end_at: end.toISOString(),
      }});
    },
    onSuccess: () => { toast.success("Κράτηση δημιουργήθηκε"); onDone(); },
    onError: (e: any) => toast.error(e.message ?? "Σφάλμα"),
  });
  return (
    <DialogShell title="Νέο Ραντεβού" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="space-y-4">
        <input required placeholder="Όνομα πελάτη" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className={fieldClass()} />
        <input required placeholder="Τηλέφωνο" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} className={fieldClass()} />
        <input type="email" placeholder="Email (προαιρετικό)" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className={fieldClass()} />
        <select required value={form.barber_id} onChange={(e) => setForm({ ...form, barber_id: e.target.value })} className={fieldClass()}>
          <option value="">Επιλέξτε κουρέα</option>
          {(barbers.data ?? []).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select required value={form.service_id} onChange={(e) => setForm({ ...form, service_id: e.target.value })} className={fieldClass()}>
          <option value="">Επιλέξτε υπηρεσία</option>
          {(services.data ?? []).map((s: any) => <option key={s.id} value={s.id}>{s.name} — {formatEuro(s.price_cents)} ({s.duration_minutes}′)</option>)}
        </select>
        <input required type="datetime-local" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className={fieldClass()} />
        <textarea placeholder="Σημειώσεις" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={fieldClass()} rows={3} />
        <button type="submit" disabled={mut.isPending} className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-amber-400 transition disabled:opacity-50">
          {mut.isPending ? "..." : "Δημιουργία"}
        </button>
      </form>
    </DialogShell>
  );
}

function EditBookingDialog({ booking, onClose, onDone }: any) {
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [start, setStart] = useState(toLocalInput(new Date(booking.start_at)));

  const notesMut = useMutation({
    mutationFn: () => updateBookingNotes({ data: { id: booking.id, notes } }),
    onSuccess: () => { toast.success("Σημειώσεις αποθηκεύτηκαν"); onDone(); },
  });
  const rescheduleMut = useMutation({
    mutationFn: () => {
      const s = new Date(start);
      const duration = booking.services?.duration_minutes ?? 30;
      const e = new Date(s.getTime() + duration * 60000);
      return rescheduleBooking({ data: { id: booking.id, start_at: s.toISOString(), end_at: e.toISOString() } });
    },
    onSuccess: () => { toast.success("Μεταφέρθηκε"); onDone(); },
    onError: (e: any) => toast.error(e.message ?? "Σφάλμα"),
  });

  return (
    <DialogShell title={`${booking.customer_name}`} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">Μετακίνηση</label>
          <div className="flex gap-2 mt-2">
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass()} />
            <button onClick={() => rescheduleMut.mutate()} disabled={rescheduleMut.isPending} className="px-4 rounded-xl bg-white text-black text-sm">Μεταφορά</button>
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">Σημειώσεις</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className={fieldClass() + " mt-2"} />
          <button onClick={() => notesMut.mutate()} disabled={notesMut.isPending} className="mt-3 w-full py-2.5 rounded-xl bg-white text-black text-sm">Αποθήκευση</button>
        </div>
      </div>
    </DialogShell>
  );
}
