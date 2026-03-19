"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBuyerAuth } from "@/lib/buyer-auth";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Heart, MapPin, Clock, Settings } from "lucide-react";

export default function BuyerDashboard() {
    const { user, logout, loading } = useBuyerAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/buyer/login");
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-teal rounded-full border-t-transparent" />
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        router.push("/buyer/login");
    };

    const menuItems = [
        { icon: Heart, label: "Saved Properties", count: "0", href: "/buyer/dashboard/bookmarks" },
        { icon: MapPin, label: "Site Visits", count: "0", href: "/buyer/dashboard/visits" },
        { icon: Clock, label: "Recently Viewed", count: "0", href: "/buyer/dashboard/recent" },
        { icon: Settings, label: "Account Settings", count: "", href: "/buyer/dashboard/settings" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Kronus" width={150} height={40} />
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading text-gray-900">
                        Welcome back, {user.name}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your properties, bookmarks, and site visit appointments
                    </p>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-teal transition"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <Icon className="w-8 h-8 text-teal" />
                                    {item.count && (
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-teal text-white text-sm font-bold rounded-full">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900">{item.label}</h3>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
                    <h2 className="text-xl font-bold font-heading text-gray-900 mb-6">
                        Browse Properties
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/projects"
                            className="flex items-center justify-center h-32 rounded-lg border-2 border-teal bg-teal/5 hover:bg-teal/10 transition"
                        >
                            <div className="text-center">
                                <p className="font-semibold text-gray-900">Featured Properties</p>
                                <p className="text-sm text-gray-600">Find your dream home</p>
                            </div>
                        </Link>
                        <Link
                            href="/blogs"
                            className="flex items-center justify-center h-32 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition"
                        >
                            <div className="text-center">
                                <p className="font-semibold text-gray-900">Buyer Guides</p>
                                <p className="text-sm text-gray-600">Learn & explore</p>
                            </div>
                        </Link>
                        <div className="flex items-center justify-center h-32 rounded-lg border-2 border-gray-200 bg-gray-50">
                            <div className="text-center">
                                <p className="font-semibold text-gray-900">Seller Feedback</p>
                                <p className="text-sm text-gray-600">Coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
