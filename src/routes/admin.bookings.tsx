import { createFileRoute } from "@tanstack/react-router";
import { BookingsList } from "@/components/admin/BookingsList";


export const Route=createFileRoute("/admin/bookings")({
component:BookingsList,
});

function Bookings(){

 return (
   <div>
     <h1 className="text-3xl">
       Ραντεβού
     </h1>

     <p className="mt-4 text-muted-foreground">
       Διαχείριση ραντεβού
     </p>
   </div>
 );

}