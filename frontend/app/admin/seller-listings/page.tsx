"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import AdminShell from "../components/AdminShell";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Clock, AlertCircle, Eye, Image as ImageIcon } from "lucide-react";

interface SellerListing {
    id: string;
    title: string;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    status: string;
    createdAt: string;
    approvedAt?: string;
    rejectionReason?: string;
    seller: {
        name: string;
        email: string;
    };
}

export default function SellerListingsPage() {
    const { user, loading } = useAdminAuth();
    const router = useRouter();
    const [listings, setListings] = useState<SellerListing[]>([]);
    const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
    const [loadingListings, setLoadingListings] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/admin/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (user) {
            fetchListings();
        }
    }, [user, activeTab]);

    async function fetchListings() {
        setLoadingListings(true);
        try {
            const endpoint =
                activeTab === "pending"
                    ? "/api/sellers/admin/listings/pending"
                    : "/api/sellers/admin/listings";
            const res = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem("kronus_admin_token")}` },
            });
            const data = await res.json();
            setListings(data.data || []);
        } catch (err) {
            console.error("Failed to fetch listings:", err);
        } finally {
            setLoadingListings(false);
        }
    }

    async function handleApprove(listingId: string) {
        try {
            const res = await fetch("/api/sellers/admin/listings/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("kronus_admin_token")}`,
                },
                body: JSON.stringify({ listingId, approve: true }),
            });

            if (res.ok) {
                await fetchListings();
            }
        } catch (err) {
            console.error("Failed to approve listing:", err);
        }
    }

    async function handleReject(listingId: string, reason: string) {
        try {
            const res = await fetch("/api/sellers/admin/listings/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("kronus_admin_token")}`,
                },
                body: JSON.stringify({ listingId, approve: false, rejectionReason: reason }),
            });

            if (res.ok) {
                await fetchListings();
            }
        } catch (err) {
            console.error("Failed to reject listing:", err);
        }
    }

    if (loading) {
        return (
            <AdminShell>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin h-8 w-8 border-4 border-teal rounded-full border-t-transparent" />
                </div>
            </AdminShell>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING_APPROVAL":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case "APPROVED":
            case "LIVE":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        <XCircle className="w-3 h-3" /> Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <AdminShell>
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Listings</h1>
                    <p className="text-gray-600">Review and approve property listings from sellers</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`py-3 font-medium border-b-2 transition ${activeTab === "pending"
                                    ? "border-teal text-teal"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Pending Approval ({listings.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`py-3 font-medium border-b-2 transition ${activeTab === "all"
                                    ? "border-teal text-teal"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            All Listings
                        </button>
                    </div>
                </div>

                {/* Listings Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {loadingListings ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin h-8 w-8 border-4 border-teal rounded-full border-t-transparent" />
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No listings to display</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Property
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Seller
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {listings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">
                                                        {listing.title}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {listing.seller.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {listing.seller.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-900">
                                                    {listing.bedrooms} BHK • {listing.area} sq.ft
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-medium text-gray-900">
                                                    ₹{(listing.price / 100000).toFixed(1)}L
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(listing.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {listing.status === "PENDING_APPROVAL" && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(listing.id)}
                                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleReject(
                                                                    listing.id,
                                                                    "Verify images and documents"
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
