"use client";

import { useState } from "react";
import { http } from "@/lib/http";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      debugger;
      const res = await http.post("/auth/login", { email, password });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      // Telnyx SIP creds
      localStorage.setItem("sipUser", res.data.telnyx.sipUser);
      localStorage.setItem("sipPassword", res.data.telnyx.sipPassword);

      // JWT login_token for WebRTC
      localStorage.setItem("telnyx_login_token", res.data.telnyx.login_token);

     
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      setMessage(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow p-8 rounded w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
