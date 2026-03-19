import { BuyerAuthProvider } from "@/lib/buyer-auth";
import { ToastProvider } from "../admin/components/Toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Buyer — Kronus Infratech",
    robots: "noindex, nofollow",
};

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
    return (
        <BuyerAuthProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </BuyerAuthProvider>
    );
}
