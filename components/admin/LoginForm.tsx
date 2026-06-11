"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Invalid password");
        return;
      }

      window.location.reload();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-sm border border-gold/25 bg-white p-8 shadow-sm"
      >
        <h1 className="font-serif text-2xl text-green">Admin</h1>
        <p className="mt-2 text-sm text-[#1a1a1a]/60">
          Sign in to manage events and RSVPs.
        </p>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#1a1a1a]/50">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-gold/25 px-4 py-3 text-sm outline-none focus:border-gold"
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}. Check <code className="text-xs">.env.local</code> for{" "}
            <code className="text-xs">ADMIN_PASSWORD</code>, then restart the
            dev server.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-sm bg-green py-3 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-green-dark disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
