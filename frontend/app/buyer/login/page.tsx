"use client";

import { Suspense, useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBuyerAuth } from "@/lib/buyer-auth";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

function BuyerLoginContent() {
    const { login, user, loading: authLoading } = useBuyerAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Check for prefilled email from query params or "no account found" state
    useEffect(() => {
        const prefillEmail = searchParams.get("email");
        const noAccountFound = searchParams.get("noAccount");

        if (prefillEmail) {
            setEmail(decodeURIComponent(prefillEmail));
        }

        if (noAccountFound === "true") {
            setError("No account found with these credentials. Please create a new account.");
        }
    }, [searchParams]);

    useEffect(() => {
        if (!authLoading && user) router.replace("/buyer/dashboard");
    }, [authLoading, user, router]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await login(email, password);
            router.push("/buyer/dashboard");
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Login failed";

            // If account not found, redirect to signup with prefilled email
            if (
                errorMsg.includes("No account found") ||
                errorMsg.includes("credentials") ||
                errorMsg.includes("not found")
            ) {
                const signupUrl = `/buyer/signup?email=${encodeURIComponent(email)}&prefill=true&noAccount=true`;
                router.push(signupUrl);
                return;
            }

            setError(errorMsg);
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
                        Find Your Dream Property
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Explore premium residential and commercial properties.
                        Save favorites, schedule site visits, and get expert assistance.
                    </p>
                    <div className="mt-10 grid grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-2xl font-bold text-teal font-heading">
                                500+
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Properties</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-teal font-heading">
                                4.8★
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Rating</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-teal font-heading">
                                10K+
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Buyers</div>
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

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h1 className="text-2xl font-bold font-heading text-gray-900 mb-2">
                            Buyer Login
                        </h1>
                        <p className="text-gray-600 text-sm mb-6">
                            Access your saved properties and bookmarks
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-teal text-white py-2.5 rounded-lg font-semibold hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <>
                                        Login
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-500">New to Kronus?</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Sign Up Link */}
                        <div className="flex items-center">
                            <Link
                                href="/buyer/signup"
                                className="w-full text-center p-2.5 border-2 bg-teal text-white rounded-lg font-semibold hover:bg-teal/90 transition"
                            >
                                Create Buyer Account
                            </Link>
                        </div>

                        {/* Seller signup */}
                        <p className="text-center text-xs text-gray-600 mt-4">
                            Are you a property seller?{" "}
                            <Link href="/seller/signup" className="text-teal font-semibold hover:underline">
                                List your property
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BuyerLoginPage() {
    return (
        <Suspense fallback={null}>
            <BuyerLoginContent />
        </Suspense>
    );
}
