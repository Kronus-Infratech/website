"use client";

import { Suspense, useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBuyerAuth } from "@/lib/buyer-auth";
import Image from "next/image";
import { User, Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

function BuyerSignupContent() {
    const { register, user, loading: authLoading } = useBuyerAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [noAccountError, setNoAccountError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Check for prefilled email and "no account found" state
    useEffect(() => {
        const prefillEmail = searchParams.get("email");
        const noAccount = searchParams.get("noAccount");

        if (prefillEmail) {
            setFormData((prev) => ({
                ...prev,
                email: decodeURIComponent(prefillEmail),
            }));
        }

        if (noAccount === "true") {
            setNoAccountError(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!authLoading && user) router.replace("/buyer/dashboard");
    }, [authLoading, user, router]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setSubmitting(true);
        try {
            await register(formData.email, formData.password, formData.name);
            router.push("/buyer/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed");
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

    const features = [
        "Save favorite properties",
        "Schedule site visits",
        "Track application status",
        "Get personalized recommendations",
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left branded panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-950 relative flex-col items-center justify-center p-12">
                <div className="absolute inset-0 bg-linear-to-br from-teal/10 via-transparent to-transparent" />
                <div className="relative z-10 max-w-md">
                    <Image
                        src="/logo_white.png"
                        alt="Kronus Infratech"
                        width={200}
                        height={60}
                        className="mx-auto mb-8 opacity-90"
                    />
                    <h2 className="text-2xl font-heading font-bold text-white mb-3">
                        Join & Explore
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        Get access to premium properties and expert assistance in your home buying journey.
                    </p>
                    <div className="space-y-3">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                                <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
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
                            Create Account
                        </h1>
                        <p className="text-gray-600 text-sm mb-6">
                            Join our community of property buyers
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Account Not Found Error */}
                            {noAccountError && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">
                                            No account found
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            We didn't find an account with these credentials. Let's create a new one!
                                        </p>
                                    </div>
                                </div>
                            )}
                            {/* Full Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

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
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password (min. 8 characters)
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
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

                            {/* Terms */}
                            <p className="text-xs text-gray-600">
                                By signing up, you agree to our{" "}
                                <Link href="/terms" className="text-teal hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-teal hover:underline">
                                    Privacy Policy
                                </Link>
                            </p>

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
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{" "}
                            <Link href="/buyer/login" className="text-teal font-semibold hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BuyerSignupPage() {
    return (
        <Suspense fallback={null}>
            <BuyerSignupContent />
        </Suspense>
    );
}
