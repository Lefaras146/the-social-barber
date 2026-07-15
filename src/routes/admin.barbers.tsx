import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listAdminBarbers, upsertBarber, deleteBarber } from "@/lib/admin.functions";
import { PageHeader, Card, Skeleton } from "@/components/admin/AdminUI";
import { Plus, Pencil, Trash2, X, Check, User } from "lucide-react";

export const Route = createFileRoute("/admin/barbers")({ component: BarbersPage });

const empty = { slug: "", name: "", role: "", bio: "", image_url: "", sort_order: 0, active: true } as any;

function BarbersPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["admin-barbers"], queryFn: () => listAdminBarbers() });
  const del = useMutation({
    mutationFn: (id: string) => deleteBarber({ data: { id } }),
    onSuccess: () => { toast.success("Διαγράφηκε"); qc.invalidateQueries({ queryKey: ["admin-barbers"] }); },
    onError: (e: any) => toast.error(e.message ?? "Σφάλμα"),
  });

  return (
    <div>
      <PageHeader title="Κουρείς" action={
        <button onClick={() => setEditing(empty)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-amber-400 transition">
          <Plus size={16} /> Νέος
        </button>
      } />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-40" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data ?? []).map((b: any) => (
            <Card key={b.id} className="flex justify-between items-start gap-4">
              <div className="flex gap-4 min-w-0">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 overflow-hidden">
                  {b.image_url ? <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" /> : <User size={20} />}
                </div>
                <div className="min-w-0">
                  <div className="text-white text-lg">{b.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">{b.role}</div>
                  {b.bio && <div className="text-xs text-zinc-400 mt-2 line-clamp-2">{b.bio}</div>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(b)} className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-zinc-300"><Pencil size={14} /></button>
                <button onClick={() => { if (confirm("Διαγραφή;")) del.mutate(b.id); }} className="p-2 rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white text-red-300"><Trash2 size={14} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && <BarberForm initial={editing} onClose={() => setEditing(null)} onDone={() => { setEditing(null); qc.invalidateQueries({ queryKey: ["admin-barbers"] }); }} />}
    </div>
  );
}

function BarberForm({ initial, onClose, onDone }: any) {
  const [f, setF] = useState({ ...empty, ...initial });
  const mut = useMutation({
    mutationFn: () => upsertBarber({ data: {
      id: f.id, slug: f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: f.name, role: f.role || null, bio: f.bio || null, image_url: f.image_url || null,
      sort_order: f.sort_order ?? 0, active: f.active ?? true,
    }}),
    onSuccess: () => { toast.success("Αποθηκεύτηκε"); onDone(); },
    onError: (e: any) => toast.error(e.message ?? "Σφάλμα"),
  });
  const input = "w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/40";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-8 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-light text-white">{f.id ? "Επεξεργασία" : "Νέος κουρέας"}</h2>
          <button type="button" onClick={onClose} className="p-2 text-zinc-400"><X size={18} /></button>
        </div>
        <input required placeholder="Όνομα" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} />
        <input placeholder="Ρόλος" value={f.role ?? ""} onChange={(e) => setF({ ...f, role: e.target.value })} className={input} />
        <input placeholder="URL φωτογραφίας" value={f.image_url ?? ""} onChange={(e) => setF({ ...f, image_url: e.target.value })} className={input} />
        <textarea placeholder="Βιογραφικό" value={f.bio ?? ""} onChange={(e) => setF({ ...f, bio: e.target.value })} className={input} rows={3} />
        <label className="flex items-center gap-3 text-sm text-white cursor-pointer">
          <input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} className="w-4 h-4" /> Ενεργός
        </label>
        <button type="submit" disabled={mut.isPending} className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-amber-400 transition disabled:opacity-50 flex items-center justify-center gap-2">
          <Check size={16} /> Αποθήκευση
        </button>
      </form>
    </div>
  );
}
