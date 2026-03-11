"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  Mail,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/site-visits", label: "Site Visits", icon: CalendarCheck },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-65 bg-gray-950 text-white flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/logo_circular.png"
              alt="Kronus"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <div className="text-sm font-bold tracking-tight font-heading">
                Kronus Admin
              </div>
              <div className="text-[10px] text-gray-500 leading-none">
                Infratech & Consultants
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            title="Close sidebar"
            className="lg:hidden text-gray-500 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <div className="px-3 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
              Menu
            </span>
          </div>
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-teal/15 text-teal shadow-sm"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* View site link */}
        <div className="px-3 pb-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition"
          >
            <ExternalLink size={14} />
            View Website
          </a>
        </div>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold">
              {user?.name?.charAt(0) ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-200 truncate">
                {user?.name}
              </div>
              <div className="text-[11px] text-gray-500 truncate">
                {user?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const items: { label: string; href: string }[] = [];

    let path = "";
    for (const seg of segments) {
      path += `/${seg}`;
      const nav = NAV.find((n) => n.href === path);
      const label = nav?.label ?? seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
      items.push({ label, href: path });
    }
    return items;
  }, [pathname]);

  if (crumbs.length <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
          {i === crumbs.length - 1 ? (
            <span className="text-gray-700 font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-gray-600 transition capitalize"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, user, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-teal rounded-full border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const pageTitle =
    NAV.find(
      (n) =>
        pathname === n.href ||
        (n.href !== "/admin" && pathname.startsWith(n.href)),
    )?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-gray-50/80">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-65">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-4 lg:px-8 h-16 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar"
            className="lg:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 font-heading truncate">
              {pageTitle}
            </h2>
            <Breadcrumbs />
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
