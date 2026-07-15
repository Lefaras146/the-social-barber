import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAdminCustomers } from "@/lib/admin.functions";
import { PageHeader, Card, Skeleton, EmptyState, formatEuro, formatDate } from "@/components/admin/AdminUI";
import { Search, Phone, Mail, User, X } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({ component: CustomersPage });

function CustomersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-customers"], queryFn: () => getAdminCustomers() });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = (data ?? []).filter((c: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q);
  });

  return (
    <div>
      <PageHeader title="Πελάτες" subtitle={`${filtered.length} πελάτες`} />
      <Card className="mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Αναζήτηση..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/40" />
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Κανένας πελάτης" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c: any) => (
            <Card key={c.phone} className="cursor-pointer hover:border-amber-500/30 transition" >
              <div onClick={() => setSelected(c)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><User size={16} /></div>
                  <div className="min-w-0">
                    <div className="text-white truncate">{c.name}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5"><Phone size={11} />{c.phone}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5">
                  <div><div className="text-lg text-white">{c.visits}</div><div className="text-[10px] text-zinc-500 uppercase tracking-wider">Επισκέψεις</div></div>
                  <div><div className="text-lg text-white">{formatEuro(c.revenueCents)}</div><div className="text-[10px] text-zinc-500 uppercase tracking-wider">Έσοδα</div></div>
                  <div><div className="text-xs text-zinc-300 mt-1">{formatDate(c.lastVisit, { day: "2-digit", month: "short" })}</div><div className="text-[10px] text-zinc-500 uppercase tracking-wider">Τελευταία</div></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950 p-8 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-2xl font-light text-white">{selected.name}</div>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mt-2">
                  <span className="flex items-center gap-1.5"><Phone size={12} />{selected.phone}</span>
                  {selected.email && <span className="flex items-center gap-1.5"><Mail size={12} />{selected.email}</span>}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 text-zinc-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Ιστορικό ({selected.history.length})</div>
            <div className="space-y-2">
              {selected.history.map((h: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between text-sm">
                  <div>
                    <div className="text-white">{h.services?.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{formatDate(h.start_at)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white">{formatEuro(h.services?.price_cents ?? 0)}</div>
                    <div className="text-[10px] text-zinc-500 uppercase mt-0.5">{h.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
