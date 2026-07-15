import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";


export const getAdminBookings = createServerFn({
 method:"GET"
})
.handler(async()=>{

 const {data,error}=await supabaseAdmin
 .from("bookings")
 .select(`
 id,
 customer_name,
 customer_phone,
 customer_email,
 start_at,
 end_at,
 status,
 notes,
 services(
   name
 )
 `)
 .order("start_at",{ascending:true});


 if(error) throw new Error(error.message);

 return data ?? [];

});

export const updateBookingStatus = createServerFn({
  method: "POST",
})
.validator((data: {
  id:string;
  status:"confirmed" | "cancelled";
}) => data)
.handler(async ({data})=>{

  const { error } = await supabaseAdmin
    .from("bookings")
    .update({
      status:data.status
    })
    .eq("id",data.id);


  if(error){
    throw new Error(error.message);
  }


  return true;

});



export const deleteBooking = createServerFn({
  method:"POST",
})
.validator((data:{
 id:string;
})=>data)
.handler(async ({data})=>{


 const {error}=await supabaseAdmin
 .from("bookings")
 .delete()
 .eq("id",data.id);


 if(error){
  throw new Error(error.message);
 }


 return true;

});