"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSellerAuth } from "@/lib/seller-auth";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Plus, FileText, Clock, AlertCircle, CheckCircle, Settings, Trash2, Edit, Eye, MapPin } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "LIVE" | "DELISTED";
  views: number;
  featured: boolean;
  propertyType: string;
  createdAt: string;
}

export default function SellerDashboard() {
    const { user, logout, loading, token } = useSellerAuth();
    const router = useRouter();
    const [listings, setListings] = useState<Listing[]>([]);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetch listings on component mount
    useEffect(() => {
        if (!loading && user && token) {
            fetchListings();
        }
    }, [loading, user, token]);

    async function fetchListings() {
        try {
            const response = await fetch("/api/sellers/listings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setListings(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        } finally {
            setListingsLoading(false);
        }
    }

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/seller/login");
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent" />
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        router.push("/seller/login");
    };

    // Calculate stats
    const totalListings = listings.length;
    const pendingListings = listings.filter((l) => l.status === "PENDING_APPROVAL").length;
    const approvedListings = listings.filter((l) => l.status === "APPROVED" || l.status === "LIVE").length;
    const totalViews = listings.reduce((sum, l) => sum + l.views, 0);

    const stats = [
        { label: "Total Listings", value: String(totalListings), icon: FileText, color: "text-blue-600" },
        { label: "Pending Approval", value: String(pendingListings), icon: Clock, color: "text-yellow-600" },
        { label: "Approved", value: String(approvedListings), icon: CheckCircle, color: "text-green-600" },
        { label: "Views This Month", value: String(totalViews), icon: Eye, color: "text-orange-600" },
    ];

    // Filter listings by status
    const filteredListings =
        statusFilter === "all" ? listings : listings.filter((l) => l.status === statusFilter.toUpperCase());

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "LIVE":
                return "bg-green-100 text-green-800";
            case "APPROVED":
                return "bg-blue-100 text-blue-800";
            case "PENDING_APPROVAL":
                return "bg-yellow-100 text-yellow-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            case "DELISTED":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING_APPROVAL":
                return "Pending";
            case "DELISTED":
                return "Delisted";
            default:
                return status;
        }
    };

    async function handleDelete(listingId: string) {
        if (!confirm("Are you sure you want to delete this listing?")) return;

        try {
            const response = await fetch(`/api/sellers/listings/${listingId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setListings(listings.filter((l) => l.id !== listingId));
            } else {
                alert("Failed to delete listing");
            }
        } catch (error) {
            console.error("Failed to delete listing:", error);
            alert("Error deleting listing");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
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

                    {/* Status Banner */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-green-900">
                                Account verified and active
                            </p>
                            <p className="text-xs text-green-700">
                                You can add and publish listings. They will require admin approval before going live.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-gray-900">
                            Welcome to Seller Portal
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage your property listings and track inquiries
                        </p>
                    </div>
                    <Link
                        href="/seller/dashboard/new-listing"
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Property
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-lg border border-gray-200 p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <Icon className={`w-10 h-10 ${stat.color}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Listings Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-heading text-gray-900">
                            My Listings
                        </h2>
                        <select
                            title="Status of Listing"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">All Listings</option>
                            <option value="PENDING_APPROVAL">Pending Approval</option>
                            <option value="APPROVED">Approved</option>
                            <option value="LIVE">Live</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>

                    {listingsLoading ? (
                        <div className="py-12 text-center">
                            <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent mx-auto" />
                            <p className="text-gray-600 mt-4">Loading listings...</p>
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <div className="py-12 text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {statusFilter === "all" ? "No listings yet" : "No listings in this category"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {statusFilter === "all"
                                    ? "Start by adding your first property listing"
                                    : "Try filtering by a different status"}
                            </p>
                            {statusFilter === "all" && (
                                <Link
                                    href="/seller/dashboard/new-listing"
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create First Listing
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredListings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(listing.status)}`}>
                                                    {getStatusLabel(listing.status)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                <MapPin className="w-4 h-4" />
                                                <span>{listing.address}, {listing.city}</span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Type</p>
                                                    <p className="font-semibold text-gray-900">{listing.propertyType}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Price</p>
                                                    <p className="font-semibold text-gray-900">₹{(listing.price / 100000).toFixed(1)}L</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Bedrooms</p>
                                                    <p className="font-semibold text-gray-900">{listing.bedrooms}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Views</p>
                                                    <p className="font-semibold text-gray-900">{listing.views}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Link
                                                href={`/seller/dashboard/edit-listing/${listing.id}`}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(listing.id)}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Settings Section */}
                <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8">
                    <h2 className="text-xl font-bold font-heading text-gray-900 mb-4">
                        Account Settings
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Manage Your Profile</p>
                            <p className="text-sm text-gray-600">
                                Update company info, bank details, and documents
                            </p>
                        </div>
                        <Link
                            href="/seller/dashboard/settings"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            <Settings className="w-4 h-4" />
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
