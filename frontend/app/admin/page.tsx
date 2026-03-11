"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Building2,
  Users,
  CalendarCheck,
  Mail,
  UserCheck,
  TrendingUp,
  Plus,
  ArrowUpRight,
  FileText,
} from "lucide-react";

interface DashboardData {
  properties: { total: number; available: number };
  leads: { total: number; new: number };
  siteVisits: { total: number; pending: number };
  newsletter: { subscribers: number };
  users: { total: number };
}

const STAT_CONFIG = [
  {
    key: "properties",
    label: "Total Properties",
    icon: Building2,
    color: "text-teal",
    bg: "bg-teal/10",
    getValue: (d: DashboardData) => d.properties.total,
    getSub: (d: DashboardData) => `${d.properties.available} available`,
  },
  {
    key: "leads",
    label: "Website Leads",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    getValue: (d: DashboardData) => d.leads.total,
    getSub: (d: DashboardData) => `${d.leads.new} new`,
  },
  {
    key: "siteVisits",
    label: "Site Visit Requests",
    icon: CalendarCheck,
    color: "text-amber-600",
    bg: "bg-amber-50",
    getValue: (d: DashboardData) => d.siteVisits.total,
    getSub: (d: DashboardData) => `${d.siteVisits.pending} pending`,
  },
  {
    key: "newsletter",
    label: "Newsletter Subscribers",
    icon: Mail,
    color: "text-purple-600",
    bg: "bg-purple-50",
    getValue: (d: DashboardData) => d.newsletter.subscribers,
    getSub: () => "active subscribers",
  },
  {
    key: "users",
    label: "Registered Users",
    icon: UserCheck,
    color: "text-green-600",
    bg: "bg-green-50",
    getValue: (d: DashboardData) => d.users.total,
    getSub: () => "on platform",
  },
  {
    key: "conversion",
    label: "Lead Conversion",
    icon: TrendingUp,
    color: "text-rose-600",
    bg: "bg-rose-50",
    getValue: (d: DashboardData) =>
      d.leads.total > 0
        ? `${Math.round(((d.leads.total - d.leads.new) / d.leads.total) * 100)}%`
        : "—",
    getSub: () => "leads progressed",
  },
];

const QUICK_ACTIONS = [
  {
    label: "New Project",
    href: "/admin/projects/new",
    icon: Building2,
    color: "bg-teal text-white hover:bg-teal/90",
  },
  {
    label: "New Blog Post",
    href: "/admin/blogs/new",
    icon: FileText,
    color: "bg-gray-900 text-white hover:bg-gray-800",
  },
  {
    label: "View Leads",
    href: "/admin/leads",
    icon: Users,
    color: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
  },
  {
    label: "Site Visits",
    href: "/admin/site-visits",
    icon: CalendarCheck,
    color: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
  },
];

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-xl bg-white animate-pulse border border-gray-100"
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardData>("/admin/dashboard")
      .then((res) => setData(res.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header with greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your website performance and data
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal/90 transition shadow-sm"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {/* Stats grid */}
      {loading ? (
        <SkeletonCards />
      ) : !data ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Failed to load dashboard data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CONFIG.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="bg-white rounded-xl border border-gray-200/80 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className={`${stat.bg} p-2.5 rounded-lg`}>
                    <Icon size={20} className={stat.color} />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-gray-900 font-heading">
                    {stat.getValue(data)}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {stat.getSub(data)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm ${action.color}`}
              >
                <Icon size={16} />
                {action.label}
                <ArrowUpRight size={14} className="opacity-50" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
