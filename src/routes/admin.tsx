import { createFileRoute, Outlet, Link, useLocation, useNavigate, redirect } from "@tanstack/react-router";
import { getAdminSession, adminLogout } from "@/lib/admin-auth";
import {
  LayoutDashboard, Calendar, Users, Scissors, UserCog, Clock,
  LogOut, Menu as MenuIcon, X as XIcon, CalendarDays,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const session = await getAdminSession();
    if (!session) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});

const menu = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Ραντεβού", path: "/admin/bookings", icon: CalendarDays },
  { name: "Ημερολόγιο", path: "/admin/calendar", icon: Calendar },
  { name: "Πελάτες", path: "/admin/customers", icon: Users },
  { name: "Υπηρεσίες", path: "/admin/services", icon: Scissors },
  { name: "Κουρείς", path: "/admin/barbers", icon: UserCog },
  { name: "Ώρες & Διακοπές", path: "/admin/hours", icon: Clock },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMobile, setOpenMobile] = useState(false);

  if (location.pathname === "/admin/login") return <Outlet />;

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  async function handleLogout() {
    await adminLogout();
    navigate({ to: "/admin/login" });
  }

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-8 pb-10">
        <div className="text-xs tracking-[0.3em] text-zinc-500 uppercase">La Barbería</div>
        <div className="text-lg font-light text-white tracking-wide mt-1">Admin</div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpenMobile(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                active
                  ? "bg-white/[0.08] text-white border border-white/10"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <Icon size={17} className={active ? "text-amber-400/80" : ""} />
              <span className="tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition"
        >
          <LogOut size={17} />
          Αποσύνδεση
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl fixed inset-y-0 left-0">
        {SidebarInner}
      </aside>

      {/* Mobile sidebar */}
      {openMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpenMobile(false)} />
          <aside className="relative w-72 bg-[#0a0a0a] border-r border-white/10">{SidebarInner}</aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-white/5">
          <button onClick={() => setOpenMobile(true)} className="p-2 text-white">
            <MenuIcon size={20} />
          </button>
          <div className="text-sm tracking-wide">Admin</div>
          <div className="w-9" />
        </header>
        <main className="p-6 md:p-10 bg-gradient-to-br from-black via-zinc-950 to-black min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
