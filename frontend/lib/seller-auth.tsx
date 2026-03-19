"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { api, setAccessToken, getAccessToken } from "@/lib/api";

export interface SellerUser {
    id: string;
    email: string;
    phone: string;
    name: string;
    avatar?: string;
    userType: "BUYER" | "SELLER";
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
}

export interface SellerProfile {
    id: string;
    userId: string;
    companyName?: string;
    businessType?: string;
    status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "SUSPENDED";
    approvedAt?: string;
    rejectionReason?: string;
    totalListings: number;
    approvedListings: number;
}

interface SellerAuthCtx {
    user: SellerUser | null;
    profile: SellerProfile | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        email: string;
        password: string;
        name: string;
        phone: string;
        companyName: string;
        businessType: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    }) => Promise<void>;
    logout: () => void;
}

const Ctx = createContext<SellerAuthCtx | null>(null);

const STORAGE_KEY = "kronus_seller_token";
const USER_KEY = "kronus_seller_user";
const PROFILE_KEY = "kronus_seller_profile";

export function SellerAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SellerUser | null>(null);
    const [profile, setProfile] = useState<SellerProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const storedUser = localStorage.getItem(USER_KEY);
            const storedProfile = localStorage.getItem(PROFILE_KEY);
            if (stored && storedUser) {
                setToken(stored);
                setAccessToken(stored);
                setUser(JSON.parse(storedUser));
                if (storedProfile) {
                    setProfile(JSON.parse(storedProfile));
                }
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await api.post<{ token: string; user: SellerUser; accessToken: string }>(
            "/auth/login/email",
            { email, password },
            { skipAuth: true },
        );
        const t = res.data!.accessToken;
        const u = res.data!.user;
        setAccessToken(t);
        setToken(t);
        setUser(u);
        localStorage.setItem(STORAGE_KEY, t);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
    }, []);

    const register = useCallback(async (data: {
        email: string;
        password: string;
        name: string;
        phone: string;
        companyName: string;
        businessType: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    }) => {
        const res = await api.post<{ token: string; user: SellerUser; accessToken: string }>(
            "/auth/register/seller",
            data,
            { skipAuth: true },
        );
        const t = res.data!.accessToken;
        const u = res.data!.user;
        setAccessToken(t);
        setToken(t);
        setUser(u);
        localStorage.setItem(STORAGE_KEY, t);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
    }, []);

    const logout = useCallback(() => {
        setAccessToken(null);
        setToken(null);
        setUser(null);
        setProfile(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PROFILE_KEY);
    }, []);

    return (
        <Ctx.Provider value={{ user, profile, token, loading, login, register, logout }}>
            {children}
        </Ctx.Provider>
    );
}

export function useSellerAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useSellerAuth must be inside SellerAuthProvider");
    return ctx;
}
