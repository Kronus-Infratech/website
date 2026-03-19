"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import AdminShell from "../components/AdminShell";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Clock, AlertCircle, Eye } from "lucide-react";

interface SellerRequest {
    id: string;
    userId: string;
    companyName: string;
    businessType: string;
    address: string;
    city: string;
    state: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
        phone: string;
    };
}

export default function SellersPage() {
    const { user, loading } = useAdminAuth();
    const router = useRouter();
    const [sellers, setSellers] = useState<SellerRequest[]>([]);
    const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
    const [loadingSellers, setLoadingSellers] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/admin/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (user) {
            fetchSellers();
        }
    }, [user, activeTab]);

    async function fetchSellers() {
        setLoadingSellers(true);
        try {
            const endpoint = activeTab === "pending" ? "/api/sellers/admin/sellers/pending" : "/api/sellers/admin/sellers";
            const res = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem("kronus_admin_token")}` },
            });
            const data = await res.json();
            setSellers(data.data || []);
        } catch (err) {
            console.error("Failed to fetch sellers:", err);
        } finally {
            setLoadingSellers(false);
        }
    }

    async function handleApprove(sellerId: string) {
        try {
            const res = await fetch("/api/sellers/admin/sellers/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("kronus_admin_token")}`,
                },
                body: JSON.stringify({ sellerId, approve: true }),
            });

            if (res.ok) {
                await fetchSellers();
            }
        } catch (err) {
            console.error("Failed to approve seller:", err);
        }
    }

    async function handleReject(sellerId: string, reason: string) {
        try {
            const res = await fetch("/api/sellers/admin/sellers/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("kronus_admin_token")}`,
                },
                body: JSON.stringify({ sellerId, approve: false, rejectionReason: reason }),
            });

            if (res.ok) {
                await fetchSellers();
            }
        } catch (err) {
            console.error("Failed to reject seller:", err);
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
                return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"><Clock className="w-3 h-3" /> Pending</span>;
            case "APPROVED":
                return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
            case "REJECTED":
                return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" /> Rejected</span>;
            default:
                return null;
        }
    };

    return (
        <AdminShell>
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Management</h1>
                    <p className="text-gray-600">Review and approve seller registrations</p>
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
                            Pending Approval ({sellers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`py-3 font-medium border-b-2 transition ${activeTab === "all"
                                    ? "border-teal text-teal"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            All Sellers
                        </button>
                    </div>
                </div>

                {/* Sellers Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {loadingSellers ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin h-8 w-8 border-4 border-teal rounded-full border-t-transparent" />
                        </div>
                    ) : sellers.length === 0 ? (
                        <div className="p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No sellers to display</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Seller Info</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {sellers.map((seller) => (
                                        <tr key={seller.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium text-gray-900">{seller.user.name}</p>
                                                    <p className="text-sm text-gray-600">{seller.user.email}</p>
                                                    <p className="text-sm text-gray-600">{seller.user.phone}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium text-gray-900">{seller.companyName}</p>
                                                    <p className="text-sm text-gray-600">{seller.businessType}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-900">{seller.city}, {seller.state}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(seller.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {seller.status === "PENDING_APPROVAL" && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(seller.userId)}
                                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(seller.userId, "Check documents")}
                                                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                <button className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition">
                                                    <Eye className="w-4 h-4" /> Details
                                                </button>
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
