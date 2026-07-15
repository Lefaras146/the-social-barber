import { useQuery } from "@tanstack/react-query";
import {
ChevronLeft,
ChevronRight,
Clock3,
Scissors
} from "lucide-react";

import {
useState
} from "react";

import {
getAdminBookings
} from "@/lib/admin.functions";



export function AdminCalendar(){


const {
data: bookings=[]
}=useQuery({

queryKey:["admin-calendar"],

queryFn:()=>getAdminBookings(),

});



const [month,setMonth]=useState(
new Date()
);



const days =
new Date(
month.getFullYear(),
month.getMonth()+1,
0
).getDate();



const monthName =
month.toLocaleDateString(
"el-GR",
{
month:"long",
year:"numeric"
}
);



function changeMonth(value:number){

setMonth(
new Date(
month.getFullYear(),
month.getMonth()+value,
1
)
);

}



return (

<div className="space-y-8">


<div className="
flex
justify-between
items-center
">


<div>

<h1 className="
text-4xl
font-light
tracking-wide
text-white
">

Ημερολόγιο

</h1>


<p className="
text-zinc-400
mt-2
capitalize
">

{monthName}

</p>


</div>



<div className="flex gap-2">

<button
onClick={()=>changeMonth(-1)}
className="
p-3
rounded-xl
bg-white/5
hover:bg-white/10
"
>

<ChevronLeft/>

</button>


<button
onClick={()=>changeMonth(1)}
className="
p-3
rounded-xl
bg-white/5
hover:bg-white/10
"
>

<ChevronRight/>

</button>


</div>


</div>



<div className="
grid
grid-cols-7
gap-3
">


{
Array.from({
length:days
}).map((_,i)=>{


const day=i+1;


const dayBookings =
bookings.filter((b:any)=>{

const d =
new Date(b.start_at);

return (

d.getDate()===day &&
d.getMonth()===month.getMonth() &&
d.getFullYear()===month.getFullYear()

);

});


return (

<div
key={day}
className="
min-h-[140px]
rounded-2xl
border
border-white/10
bg-zinc-900/60
p-3
"
>


<div className="
text-zinc-400
text-sm
mb-3
">

{day}

</div>



<div className="
space-y-2
">


{
dayBookings.map((booking:any)=>(


<button
key={booking.id}
className="
w-full
text-left
rounded-xl
bg-white/5
hover:bg-amber-500/10
border
border-white/10
p-3
transition
"
>


<div className="
text-white
font-medium
truncate
">

{booking.customer_name}

</div>



<div className="
flex
items-center
gap-2
text-xs
text-zinc-400
mt-1
">

<Clock3 size={12}/>


{
new Date(
booking.start_at
).toLocaleTimeString(
"el-GR",
{
hour:"2-digit",
minute:"2-digit"
}
)
}


</div>



<div className="
flex
items-center
gap-2
text-xs
text-zinc-400
mt-1
">

<Scissors size={12}/>

{booking.services?.name}

</div>


</button>


))
}



</div>


</div>


);

})
}


</div>


</div>

);

}