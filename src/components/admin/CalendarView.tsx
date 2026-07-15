import { useQuery } from "@tanstack/react-query";
import { getAdminBookings } from "@/lib/admin.functions";
import { Clock3, Phone } from "lucide-react";


export function CalendarView(){

const {
data: bookings=[]
}=useQuery({
queryKey:["admin-calendar"],
queryFn:()=>getAdminBookings(),
});


return (

<div>

<h1
className="
text-4xl
font-serif
tracking-wide
mb-10
text-white
"
>
Ημερολόγιο
</h1>


<div
className="
grid
grid-cols-7
gap-4
"
>


{
Array.from({length:7}).map((_,i)=>(

<div
key={i}
className="
min-h-[180px]
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-4
"
>

<p
className="
text-sm
text-zinc-500
mb-4
"
>
{["Δευ","Τρι","Τετ","Πεμ","Παρ","Σαβ","Κυρ"][i]}
</p>



{
bookings
.filter(b=>{
const d=new Date(b.start_at);
return d.getDay()===i+1;
})
.map(b=>(

<div
key={b.id}
className="
mb-3
rounded-xl
bg-white/[0.08]
p-3
cursor-pointer
hover:border
hover:border-amber-500
transition
"
>


<p
className="
font-serif
text-white
"
>
{b.customer_name}
</p>


<div
className="
text-xs
text-zinc-400
mt-2
flex
gap-2
"
>

<Clock3 size={13}/>

{
new Date(b.start_at)
.toLocaleTimeString(
"el-GR",
{
hour:"2-digit",
minute:"2-digit"
}
)
}

</div>


<div
className="
text-xs
text-zinc-400
flex
gap-2
mt-1
"
>

<Phone size={13}/>

{b.customer_phone}

</div>


</div>


))

}


</div>

))

}


</div>

</div>

);

}