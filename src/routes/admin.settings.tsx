import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">
        Ρυθμίσεις
      </h1>

      <p className="text-white/60">
        Θα προστεθούν στο επόμενο βήμα.
      </p>
    </div>
  );
}