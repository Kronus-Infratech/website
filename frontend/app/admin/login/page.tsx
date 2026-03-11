"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { login, user, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/admin");
  }, [authLoading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin h-8 w-8 border-4 border-teal rounded-full border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 relative flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-linear-to-br from-teal/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-md text-center">
          <Image
            src="/logo_white.png"
            alt="Kronus Infratech"
            width={200}
            height={60}
            className="mx-auto mb-8 opacity-90"
          />
          <h2 className="text-2xl font-heading font-bold text-white mb-3">
            Admin Portal
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Manage your projects, blog content, leads, and site visits
            from one central dashboard.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-teal font-heading">
                Projects
              </div>
              <div className="text-xs text-gray-500 mt-1">Create & Edit</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal font-heading">
                Blogs
              </div>
              <div className="text-xs text-gray-500 mt-1">Publish Content</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal font-heading">
                Leads
              </div>
              <div className="text-xs text-gray-500 mt-1">Track & Manage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/logo.png"
              alt="Kronus Infratech"
              width={160}
              height={48}
              className="mx-auto"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 font-heading">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to your admin account
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <Lock size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal/50 focus:border-teal outline-none transition bg-white"
                  placeholder="admin@kronusinfra.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-teal/50 focus:border-teal outline-none transition bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  title="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal text-white font-semibold py-2.5 rounded-lg hover:bg-teal/90 transition disabled:opacity-60 shadow-sm"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Kronus Infratech & Consultants
          </p>
        </div>
      </div>
    </div>
  );
}
