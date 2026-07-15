import { createFileRoute } from "@tanstack/react-router";
import { AdminCalendar } from "@/components/admin/AdminCalendar";


export const Route = createFileRoute("/admin/calendar")({
  component: AdminCalendarPage,
});


function AdminCalendarPage(){

return (
  <AdminCalendar />
);

}