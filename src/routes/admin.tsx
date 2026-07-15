import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({

  beforeLoad: async ({ location }) => {

    if (location.pathname === "/admin/login") {
      return;
    }


    const session = await getAdminSession();


    if (!session) {
      throw redirect({
        to: "/admin/login",
      });
    }

  },

  component: AdminLayout,

});

function AdminLayout() {

  const location = useLocation();
  if (location.pathname === "/admin/login") {
  return <Outlet />;
}


const menu = [
{
 name:"Ημερολόγιο",
 path:"/admin",
},
{
 name:"Ραντεβού",
 path:"/admin/bookings",
},
{
 name:"Ρυθμίσεις",
 path:"/admin/settings",
},
];


  return (
    <div className="min-h-screen bg-background text-foreground flex">


      {/* Sidebar */}

      <aside className="w-64 border-r border-white/10 p-6">


              <h1 className="
      text-2xl
      font-semibold
      tracking-wide
      mb-10
      ">
      ADMIN BARBER
      </h1>

      <button
        className="
        w-full
        mb-8
        rounded-xl
        bg-white
        text-black
        py-3
        font-medium
        hover:opacity-90
        transition
      "
      >
      + Νέο Ραντεβού
    </button>


        <nav className="space-y-2">


          {menu.map((item)=>(
            <Link
              key={item.path}
              to={item.path}
              className={`
                block px-4 py-3 rounded-lg transition
                ${
                  location.pathname === item.path
                  ? "bg-white text-black"
                  : "hover:bg-white/10"
                }
              `}
            >
              {item.name}
            </Link>
          ))}


        </nav>


      </aside>



      {/* Content */}

      <section className="
flex-1
p-10
bg-gradient-to-br
from-black
via-zinc-950
to-black
">

<Outlet />


<section
className="
flex-1
p-10
bg-gradient-to-br
from-black
via-zinc-950
to-black
"
>

<Outlet />

</section>

</section>



    </div>
  );
}