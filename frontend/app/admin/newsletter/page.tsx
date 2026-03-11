"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Mail, Users } from "lucide-react";
import { useToast } from "../components/Toast";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      const res = await api.get<Subscriber[]>(`/admin/newsletter?${params}`);
      setSubscribers(res.data ?? []);
      setTotalPages(Number(res.meta?.totalPages ?? 1));
      setTotal(Number(res.meta?.total ?? 0));
    } catch {
      toast("error", "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your email subscriber list</p>
        </div>
        <div className="flex items-center gap-2 bg-teal/10 text-teal px-3.5 py-2 rounded-lg text-sm font-medium">
          <Users size={16} />
          {total} subscriber{total !== 1 && "s"}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">#</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={3} className="px-5 py-4">
                    <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-16 text-center">
                  <Mail size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No subscribers yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Subscribers will appear when visitors sign up for your newsletter
                  </p>
                </td>
              </tr>
            ) : (
              subscribers.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50/70 transition">
                  <td className="px-5 py-3.5 text-gray-400 tabular-nums">
                    {(page - 1) * 50 + idx + 1}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-gray-900">{s.email}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(s.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
