"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";

interface Blog {
  id: string;
  slug: string;
  title: string;
  category: string;
  authorName: string;
  featured: boolean;
  published: boolean;
  date: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const { toast } = useToast();

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await api.get<Blog[]>(`/blogs/admin/list?${params}`);
      setBlogs(res.data ?? []);
      setTotalPages(Number(res.meta?.totalPages ?? 1));
    } catch {
      toast("error", "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, [page, search, toast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/blogs/admin/${deleteTarget.id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      toast("success", `"${deleteTarget.title}" deleted`);
    } catch {
      toast("error", "Failed to delete blog post");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your blog content</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 bg-teal text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-teal/90 transition shadow-sm"
        >
          <Plus size={16} />
          New Blog Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search blog posts…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-teal/50 focus:border-teal outline-none bg-white shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Author</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Published</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-5 py-4">
                    <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-3/4" />
                  </td>
                </tr>
              ))
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="text-gray-400">
                    <Search size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="font-medium">No blog posts found</p>
                    <p className="text-xs mt-1">Try adjusting your search or create a new post</p>
                  </div>
                </td>
              </tr>
            ) : (
              blogs.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/70 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900 max-w-xs truncate">{b.title}</div>
                    {b.featured && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal/10 text-teal uppercase">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                      {b.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">{b.authorName}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs hidden lg:table-cell">
                    {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-center hidden md:table-cell">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${b.published ? "bg-green-500" : "bg-gray-300"}`} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/blogs/${b.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on site"
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                      >
                        <Eye size={15} />
                      </a>
                      <Link
                        href={`/admin/blogs/${b.id}/edit`}
                        title="Edit blog post"
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        title="Delete blog post"
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
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
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 px-3">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
