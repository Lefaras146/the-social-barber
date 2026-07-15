import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { adminLogin } from "@/lib/admin-auth";


export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin(){

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");

  const [loading,setLoading] = useState(false);



  async function handleLogin(){

    try {

      setLoading(true);
      setError("");

      await adminLogin(email,password);

      navigate({
        to:"/admin"
      });


    } catch(err:any){

      setError(
        err.message || "Login failed"
      );

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="min-h-screen flex items-center justify-center">


      <div className="w-full max-w-md border border-white/10 rounded-xl p-8">


        <h1 className="text-2xl mb-6">
          Admin Login
        </h1>



        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-black/20 border border-white/10"
        />



        <input
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-black/20 border border-white/10"
        />



        {error && (
          <p className="text-red-400 mb-4">
            {error}
          </p>
        )}



        <button
          disabled={loading}
          onClick={handleLogin}
          className="w-full p-3 rounded bg-white text-black"
        >
          {loading ? "Loading..." : "Login"}
        </button>


      </div>


    </div>

  );
}