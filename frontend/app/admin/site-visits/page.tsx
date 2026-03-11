"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { CalendarCheck, ExternalLink, MapPin } from "lucide-react";
import { useToast } from "../components/Toast";

interface SiteVisit {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  projectSlug?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function AdminSiteVisitsPage() {
  const { toast } = useToast();
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      const res = await api.get<SiteVisit[]>(`/admin/site-visits?${params}`);
      setVisits(res.data ?? []);
      setTotalPages(Number(res.meta?.totalPages ?? 1));
      setTotal(Number(res.meta?.total ?? 0));
    } catch {
      toast("error", "Failed to load site visits");
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdating(id);
    try {
      await api.patch(`/admin/site-visits/${id}`, { status: newStatus });
      setVisits((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)),
      );
      toast("success", `Status updated to ${newStatus}`);
    } catch {
      toast("error", "Failed to update status");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Site Visits</h1>
          <p className="text-sm text-gray-500 mt-1">Manage property visit requests</p>
        </div>
        <div className="flex items-center gap-2 bg-teal/10 text-teal px-3.5 py-2 rounded-lg text-sm font-medium">
          <CalendarCheck size={16} />
          {total} request{total !== 1 && "s"}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitor</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Preferred Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-5 py-4">
                    <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))
            ) : visits.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No site visit requests</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Requests will appear when visitors schedule property visits
                  </p>
                </td>
              </tr>
            ) : (
              visits.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/70 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-gray-900">{v.name}</span>
                    {v.notes && (
                      <span className="block text-[11px] text-gray-400 mt-0.5 truncate max-w-45">
                        {v.notes}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-gray-700">{v.email}</div>
                    <div className="text-xs text-gray-400">{v.phone}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                    {v.preferredDate
                      ? new Date(v.preferredDate).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "—"}
                    {v.preferredTime && (
                      <span className="text-gray-400"> at {v.preferredTime}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {v.projectSlug ? (
                      <a
                        href={`/projects/${v.projectSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-teal text-xs font-medium hover:underline"
                      >
                        {v.projectSlug} <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={v.status}
                      title="Change status"
                      disabled={updating === v.id}
                      onChange={(e) => handleStatusChange(v.id, e.target.value)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-teal/50 outline-none transition ${
                        STATUS_COLORS[v.status] ?? "bg-gray-100 text-gray-600"
                      } ${updating === v.id ? "opacity-50 cursor-wait" : ""}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(v.createdAt).toLocaleDateString("en-IN", {
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
