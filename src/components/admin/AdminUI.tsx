import { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 className="text-3xl md:text-4xl font-light tracking-wide text-white">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</div>
      <div className="mt-3 text-3xl font-light text-white">{value}</div>
      {hint && <div className="mt-2 text-xs text-zinc-500">{hint}</div>}
    </Card>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/[0.05] rounded-xl ${className}`} />;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-16 text-zinc-500">
      <div className="text-lg">{title}</div>
      {hint && <div className="text-sm mt-2">{hint}</div>}
    </div>
  );
}

export function formatEuro(cents: number) {
  return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);
}

export function formatDate(d: string | Date, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" }) {
  return new Intl.DateTimeFormat("el-GR", opts).format(new Date(d));
}
