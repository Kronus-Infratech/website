import { SellerAuthProvider } from "@/lib/seller-auth";
import { ToastProvider } from "../admin/components/Toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Seller — Kronus Infratech",
    robots: "noindex, nofollow",
};

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    return (
        <SellerAuthProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </SellerAuthProvider>
    );
}
