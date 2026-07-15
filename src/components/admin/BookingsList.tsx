import { 
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  Check,
  X,
  Trash2,
  Clock3,
  Phone,
  Scissors,
} from "lucide-react";

import { 
  getAdminBookings,
  updateBookingStatus,
  deleteBooking
} from "@/lib/admin.functions";

export function BookingsList() {

const queryClient = useQueryClient();


const {
 data: bookings,
 error,
 isLoading

} = useQuery({

 queryKey:["admin-bookings"],

 queryFn: () => getAdminBookings(),

});

async function changeStatus(
 id:string,
 status:"confirmed"|"cancelled"
){

 await updateBookingStatus({
  data:{
   id,
   status
  }
 });


 queryClient.invalidateQueries({
  queryKey:["admin-bookings"]
 });

}



async function removeBooking(id:string){

 if(!confirm("Διαγραφή ραντεβού;")) return;


 await deleteBooking({
  data:{
   id
  }
 });


 queryClient.invalidateQueries({
  queryKey:["admin-bookings"]
 });

}


if(isLoading){
 return <div>Φόρτωση ραντεβού...</div>;
}


if(error){
 return (
  <div>
   Booking error: {error.message}
  </div>
 );
}


return (

<div>

<h2 className="
text-4xl
font-light
tracking-[0.18em]
uppercase
mb-10
">
Ραντεβού
</h2>

<div className="space-y-6">


{bookings?.map((booking)=>(

<div
key={booking.id}
className="
group
rounded-3xl
border
border-white/10
bg-zinc-900/70
backdrop-blur-xl
p-6
transition-all
duration-300
hover:border-[#C6A15B]
shadow-lg
shadow-black/20
hover:bg-zinc-900
"
>


<div>
<h3
  className="
    text-2xl
    font-light
    tracking-wide
    text-white
  "
>
  {booking.customer_name}
</h3>
</div>




<div className="mt-5 flex flex-wrap gap-6 text-zinc-400 text-sm">

  <div className="flex items-center gap-2">

    <Clock3 size={15} />

    {new Date(booking.start_at).toLocaleString("el-GR")}

  </div>

  <div className="flex items-center gap-2">

    <Scissors size={15} />

    {booking.services?.name}

  </div>

  <div className="flex items-center gap-2">

    <Phone size={15} />

    {booking.customer_phone}

  </div>

</div>


<div>
<span
className={`
inline-flex
mt-5
rounded-full
px-4
py-1.5
text-xs
uppercase
tracking-[0.25em]
font-medium

${
booking.status==="confirmed"

? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"

: "bg-red-500/15 text-red-300 border border-red-500/20"

}
`}
>

{booking.status}

</span>

<div className="flex gap-3 mt-6">

<button
onClick={() => changeStatus(booking.id,"confirmed")}
className="
rounded-xl
border
border-emerald-500/40
px-5
py-2.5
text-sm
transition
hover:bg-emerald-500
hover:text-black
flex items-center gap-2
"
>

<Check size={16}/>

Confirm

</button>

<button
onClick={() => changeStatus(booking.id,"cancelled")}
className="
rounded-xl
border
border-orange-400/40
px-5
py-2.5
text-sm
transition
hover:bg-orange-400
hover:text-black
flex items-center gap-2
"
>

<X size={16}/>

Cancel

</button>

<button
onClick={() => removeBooking(booking.id)}
className="
rounded-xl
border
border-red-500/40
px-5
py-2.5
text-sm
transition
hover:bg-red-500
hover:text-white
flex items-center gap-2
"
>

<Trash2 size={16}/>

Delete

</button>

</div>

</div>





</div>

))}


</div>

</div>

);

}