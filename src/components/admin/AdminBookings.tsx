import { useState } from "react";

type Booking = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  start_at: string;
  status: string;
  service_name?: string;
  barber_name?: string;
};

export function AdminBookings({
  bookings,
}: {
  bookings: Booking[];
}) {

  const [items, setItems] = useState(bookings);


  function changeStatus(id:string,status:string){
    setItems(prev =>
      prev.map(b =>
        b.id === id
        ? {...b,status}
        : b
      )
    );

    // εδώ μετά θα μπει Supabase update
  }


  return (
    <div className="space-y-6">


      <div>
        <h2 className="text-3xl font-semibold tracking-tight">
          Ραντεβού
        </h2>

        <p className="text-muted-foreground mt-2">
          Διαχείριση καθημερινών κρατήσεων
        </p>
      </div>



      <div className="grid gap-4">


      {items.length === 0 && (

        <div className="
        rounded-2xl
        border
        border-white/10
        p-8
        text-center
        bg-white/5
        ">
          Δεν υπάρχουν ραντεβού
        </div>

      )}



      {items.map((booking)=>(


        <div
        key={booking.id}
        className="
        rounded-2xl
        border
        border-white/10
        bg-black/20
        p-6
        backdrop-blur
        "
        >


          <div className="flex justify-between">


            <div>

              <h3 className="text-xl font-medium">
                {booking.customer_name}
              </h3>


              <p className="text-sm opacity-70">
                {booking.customer_phone}
              </p>


              <p className="text-sm opacity-70">
                {booking.customer_email}
              </p>


            </div>



            <span className="
            px-3 py-1
            rounded-full
            text-sm
            bg-white/10
            ">
              {booking.status}
            </span>


          </div>



          <div className="mt-5 text-sm space-y-1">

            <p>
              🕒 {new Date(booking.start_at).toLocaleString("el-GR")}
            </p>


            {booking.service_name && (
              <p>
                ✂️ {booking.service_name}
              </p>
            )}


            {booking.barber_name && (
              <p>
                💈 {booking.barber_name}
              </p>
            )}

          </div>



          <div className="flex gap-3 mt-6">


            <button
            onClick={()=>changeStatus(
              booking.id,
              "confirmed"
            )}
            className="
            px-4 py-2
            rounded-xl
            bg-white
            text-black
            hover:opacity-80
            "
            >
              Επιβεβαίωση
            </button>



            <button
            onClick={()=>changeStatus(
              booking.id,
              "cancelled"
            )}
            className="
            px-4 py-2
            rounded-xl
            border
            border-red-400/30
            text-red-300
            hover:bg-red-400/10
            "
            >
              Ακύρωση
            </button>



          </div>



        </div>


      ))}


      </div>


    </div>
  )
}