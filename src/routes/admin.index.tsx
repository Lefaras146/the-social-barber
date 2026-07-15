import { createFileRoute } from "@tanstack/react-router";
import { BookingsList } from "@/components/admin/BookingsList";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});


function AdminHome(){

return (
  <div>

    <BookingsList />

  </div>
);

}