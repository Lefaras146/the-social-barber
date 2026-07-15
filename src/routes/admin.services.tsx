import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listAdminServices, upsertService, deleteService } from "@/lib/admin.functions";
import { PageHeader, Card, Skeleton, formatEuro } from "@/components/admin/AdminUI";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

export const Route = createFileRoute("/admin/services")({ component: ServicesPage });

const empty = { slug: "", name: "", category: "haircut", price_cents: 0, duration_minutes: 30, sort_order: 0, active: true } as any;

function ServicesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["admin-services"], queryFn: () => listAdminServices() });

  const del = useMutation({
    mutationFn: (id: string) => deleteService({ data: { id } }),
    onSuccess: () => { toast.success("Διαγράφηκε"); qc.invalidateQueries({ queryKey: ["admin-services"] }); },
    onError: () => toast.error("Αποτυχία"),
  });

  return (
    <div>
      <PageHeader title="Υπηρεσίες" subtitle={`${data?.length ?? 0} υπηρεσίες`} action={
        <button onClick={() => setEditing(empty)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-amber-400 transition">
          <Plus size={16} /> Νέα
        </button>
      } />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="space-y-2">
          {(data ?? []).map((s: any) => (
            <Card key={s.id} className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={`w-2 h-10 rounded-full ${s.active ? "bg-amber-400" : "bg-zinc-700"}`} />
                <div className="min-w-0">
                  <div className="text-white">{s.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">{s.category} · {s.duration_minutes}′ · {formatEuro(s.price_cents)}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(s)} className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-zinc-300"><Pencil size={14} /></button>
                <button onClick={() => { if (confirm("Διαγραφή;")) del.mutate(s.id); }} className="p-2 rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white text-red-300"><Trash2 size={14} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && <ServiceForm initial={editing} onClose={() => setEditing(null)} onDone={() => { setEditing(null); qc.invalidateQueries({ queryKey: ["admin-services"] }); }} />}
    </div>
  );
}

function ServiceForm({ initial, onClose, onDone }: any) {
  const [f, setF] = useState({
    id: initial.id, slug: initial.slug ?? "", name: initial.name ?? "", category: initial.category ?? "haircut",
    price_euros: (initial.price_cents ?? 0) / 100, duration_minutes: initial.duration_minutes ?? 30,
    sort_order: initial.sort_order ?? 0, active: initial.active ?? true,
  });
  const mut = useMutation({
    mutationFn: () => upsertService({ data: {
      id: f.id, slug: f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: f.name, category: f.category, price_cents: Math.round(f.price_euros * 100),
      duration_minutes: f.duration_minutes, sort_order: f.sort_order, active: f.active,
    }}),
    onSuccess: () => { toast.success("Αποθηκεύτηκε"); onDone(); },
    onError: (e: any) => toast.error(e.message ?? "Σφάλμα"),
  });
  const input = "w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/40";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-8 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-light text-white">{f.id ? "Επεξεργασία" : "Νέα υπηρεσία"}</h2>
          <button type="button" onClick={onClose} className="p-2 text-zinc-400"><X size={18} /></button>
        </div>
        <input required placeholder="Όνομα" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} />
        <input placeholder="Slug (αυτόματο)" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} className={input} />
        <input required placeholder="Κατηγορία" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={input} />
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-xs text-zinc-500">Τιμή (€)</span>
            <input required type="number" step="0.5" min="0" value={f.price_euros} onChange={(e) => setF({ ...f, price_euros: +e.target.value })} className={input + " mt-1"} /></label>
          <label className="block"><span className="text-xs text-zinc-500">Διάρκεια (λεπτά)</span>
            <input required type="number" min="5" step="5" value={f.duration_minutes} onChange={(e) => setF({ ...f, duration_minutes: +e.target.value })} className={input + " mt-1"} /></label>
        </div>
        <label className="flex items-center gap-3 text-sm text-white cursor-pointer">
          <input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} className="w-4 h-4" /> Ενεργό
        </label>
        <button type="submit" disabled={mut.isPending} className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-amber-400 transition disabled:opacity-50 flex items-center justify-center gap-2">
          <Check size={16} /> Αποθήκευση
        </button>
      </form>
    </div>
  );
}
