import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/customers")({
  component: Customers,
});

function Customers() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">
        Πελάτες
      </h1>

      <p className="text-white/60">
        Θα προστεθεί στο επόμενο βήμα.
      </p>
    </div>
  );
}