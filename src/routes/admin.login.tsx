import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { adminLogin, adminSignup } from "@/lib/admin-auth";
import { Scissors, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await adminLogin(email, password);
      } else {
        await adminSignup(email, password);
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Scissors className="text-amber-400/80" size={22} />
          <span className="text-xs tracking-[0.35em] text-zinc-400 uppercase">La Barbería · Admin</span>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl p-8 space-y-5">
          <h1 className="text-2xl font-light tracking-wide text-white">
            {mode === "login" ? "Σύνδεση" : "Δημιουργία λογαριασμού"}
          </h1>
          <div className="space-y-3">
            <input
              type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/40"
            />
            <input
              type="password" required minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Κωδικός"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-amber-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {mode === "login" ? "Σύνδεση" : "Εγγραφή"}
          </button>
          <button
            type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-sm text-zinc-400 hover:text-white transition"
          >
            {mode === "login" ? "Δεν έχετε λογαριασμό; Εγγραφή" : "Έχετε λογαριασμό; Σύνδεση"}
          </button>
          <p className="text-xs text-zinc-500 text-center pt-2 leading-relaxed">
            Ο πρώτος λογαριασμός γίνεται αυτόματα διαχειριστής.
          </p>
        </form>
      </div>
    </div>
  );
}
