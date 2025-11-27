"use client";

import { useState } from "react";
import { http } from "@/lib/http";
import { AxiosError } from "axios";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await http.post("/auth/register", {
        name,
        email,
        password,
      });

      setMessage("Registration successful!");
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      setMessage(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow p-8 rounded w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create Account</h2>

        <form onSubmit={registerUser} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
