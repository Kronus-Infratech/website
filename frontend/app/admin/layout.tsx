import { AdminAuthProvider } from "@/lib/admin-auth";
import AdminShell from "./components/AdminShell";
import { ToastProvider } from "./components/Toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin — Kronus Infratech",
    robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            <ToastProvider>
                <AdminShell>{children}</AdminShell>
            </ToastProvider>
        </AdminAuthProvider>
    );
}
