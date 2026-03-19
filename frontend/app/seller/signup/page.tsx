"use client";

import { Suspense, useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSellerAuth } from "@/lib/seller-auth";
import Image from "next/image";
import { User, Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle2, Building2, MapPin, AlertCircle } from "lucide-react";
import Link from "next/link";

function SellerSignupContent() {
    const { register, user, loading: authLoading } = useSellerAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState<"personal" | "business">("personal");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        businessType: "",
        address: "",
        city: "",
        state: "Haryana", // Default to Haryana
        pincode: "",
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
        if (!authLoading && user) router.replace("/seller/dashboard");
    }, [authLoading, user, router]);

    async function handlePersonalStep(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setStep("business");
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (!formData.pincode.match(/^\d{6}$/)) {
            setError("Valid 6-digit pincode required");
            return;
        }

        setSubmitting(true);
        try {
            await register({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                companyName: formData.companyName,
                businessType: formData.businessType,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
            });
            router.push("/seller/dashboard");
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

    const benefits = [
        "List unlimited properties",
        "Track inquiries & leads",
        "Admin verification process",
        "Professional seller profile",
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
                        Grow Your Business
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        Connect with thousands of buyers looking for properties like yours.
                    </p>
                    <div className="space-y-3">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                                <span className="text-sm text-gray-300">{benefit}</span>
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
                        {/* <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold text-white ${step === "personal" ? "bg-teal" : "bg-gray-300"}`}>
                                    1
                                </div>
                                <span className="text-sm font-medium text-gray-700">Personal Info</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold text-white ${step === "business" ? "bg-teal" : "bg-gray-300"}`}>
                                    2
                                </div>
                                <span className="text-sm font-medium text-gray-700">Business Info</span>
                            </div>
                        </div> */}

                        {step === "personal" ? (
                            <form onSubmit={handlePersonalStep} className="space-y-4">
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

                                <div>
                                    <h1 className="text-2xl font-bold font-heading text-gray-900 mb-1">
                                        Personal Details
                                    </h1>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Tell us about yourself
                                    </p>
                                </div>

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

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                        required
                                    />
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

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full bg-teal text-white py-2.5 rounded-lg font-semibold hover:bg-teal/90 transition flex items-center justify-center gap-2"
                                >
                                    Next: Business Info
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-bold font-heading text-gray-900 mb-1">
                                        Business Information
                                    </h1>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Tell us about your business (Pending admin approval)
                                    </p>
                                </div>

                                {/* Company Name */}
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            id="companyName"
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            placeholder="ABC Real Estate"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Business Type */}
                                <div>
                                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Type
                                    </label>
                                    <select
                                        id="businessType"
                                        value={formData.businessType}
                                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select business type</option>
                                        <option value="Individual">Individual</option>
                                        <option value="Agency">Agency</option>
                                        <option value="Developer">Developer</option>
                                        <option value="Company">Company</option>
                                    </select>
                                </div>

                                {/* Address */}
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            id="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="123 Business Street"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* City & Pincode */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="Sonipat"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                                            Pincode
                                        </label>
                                        <input
                                            id="pincode"
                                            type="text"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            placeholder="131001"
                                            maxLength={6}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* State - read-only with option to change later */}
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                                        State <span className="text-xs text-gray-500">(Changeable in settings)</span>
                                    </label>
                                    <input
                                        id="state"
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        placeholder="Haryana"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Info */}
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                                    <strong>Note:</strong> Your account will be active immediately. Listings require individual admin approval before going live.
                                </div>

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
                                            Complete Registration
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {/* Back */}
                                <button
                                    type="button"
                                    onClick={() => setStep("personal")}
                                    className="w-full py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                                >
                                    Back
                                </button>
                            </form>
                        )}

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{" "}
                            <Link href="/seller/login" className="text-teal font-semibold hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SellerSignupPage() {
    return (
        <Suspense fallback={null}>
            <SellerSignupContent />
        </Suspense>
    );
}
