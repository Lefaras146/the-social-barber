import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useBooking } from "@/lib/booking-context";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Κλείσε ραντεβού — La Barbería Social Club" },
      {
        name: "description",
        content:
          "Κλείστε online το ραντεβού σας στο La Barbería Social Club — Ι. Φωκά 90, Λαμπρινή, Αθήνα.",
      },
      { property: "og:title", content: "Ραντεβού — La Barbería" },
      {
        property: "og:description",
        content: "Κλείστε το ραντεβού σας online.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookRoute,
});

function BookRoute() {
  const { open, isOpen } = useBooking();
  const navigate = useNavigate();

  // Open the overlay on mount.
  useEffect(() => {
    open();
  }, [open]);

  // When the user closes the overlay, return to the home page.
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => navigate({ to: "/" }), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen, navigate]);

  return (
    <div className="min-h-screen bg-onyx" aria-hidden="true">
      {/* Overlay handles the UI. */}
    </div>
  );
}
