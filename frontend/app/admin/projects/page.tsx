"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Project {
    id: string;
    slug: string;
    title: string;
    type: string;
    status: string;
    price: string;
    location: string;
    featured: boolean;
    published: boolean;
    createdAt: string;
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (search) params.set("search", search);
            const res = await api.get<Project[]>(`/projects/admin/list?${params}`);
            setProjects(res.data ?? []);
            setTotalPages(Number(res.meta?.totalPages ?? 1));
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    async function handleDelete(id: string) {
        if (!confirm("Delete this project?")) return;
        setDeleting(id);
        try {
            await api.delete(`/projects/admin/${id}`);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert("Failed to delete project");
        } finally {
            setDeleting(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 font-heading">
                    Projects
                </h1>
                <Link
                    href="/admin/projects/new"
                    className="inline-flex items-center gap-2 bg-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal/90 transition"
                >
                    <Plus size={16} />
                    Add Project
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Search projects…"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-left text-gray-500 uppercase text-xs">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3 text-center">Featured</th>
                            <th className="px-4 py-3 text-center">Published</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-50">
                                    <td colSpan={8} className="px-4 py-4">
                                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                    </td>
                                </tr>
                            ))
                        ) : projects.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                                    No projects found
                                </td>
                            </tr>
                        ) : (
                            projects.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {p.title}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{p.type}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${p.status === "Ready to Move"
                                                    ? "bg-green-50 text-green-700"
                                                    : p.status === "Under Construction"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-blue-50 text-blue-700"
                                                }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{p.price}</td>
                                    <td className="px-4 py-3 text-gray-600">{p.location}</td>
                                    <td className="px-4 py-3 text-center">
                                        {p.featured ? (
                                            <span className="text-teal font-semibold">Yes</span>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {p.published ? (
                                            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                        ) : (
                                            <span className="inline-block w-2 h-2 rounded-full bg-gray-300" />
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/projects/${p.id}/edit`}
                                                className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                title="Delete Project"
                                                disabled={deleting === p.id}
                                                className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition disabled:opacity-50"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
