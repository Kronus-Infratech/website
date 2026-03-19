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

export interface BuyerUser {
    id: string;
    email: string;
    phone: string;
    name: string;
    avatar?: string;
    userType: "BUYER" | "SELLER";
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
}

interface BuyerAuthCtx {
    user: BuyerUser | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
}

const Ctx = createContext<BuyerAuthCtx | null>(null);

const STORAGE_KEY = "kronus_buyer_token";
const USER_KEY = "kronus_buyer_user";

export function BuyerAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<BuyerUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const storedUser = localStorage.getItem(USER_KEY);
            if (stored && storedUser) {
                setToken(stored);
                setAccessToken(stored);
                setUser(JSON.parse(storedUser));
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await api.post<{ token: string; user: BuyerUser }>(
            "/auth/login/email",
            { email, password },
            { skipAuth: true },
        );
        const t = res.data!.token;
        const u = res.data!.user;
        setAccessToken(t);
        setToken(t);
        setUser(u);
        localStorage.setItem(STORAGE_KEY, t);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
    }, []);

    const register = useCallback(async (email: string, password: string, name: string) => {
        const res = await api.post<{ token: string; user: BuyerUser; accessToken: string }>(
            "/auth/register",
            { email, password, name },
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
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
    }, []);

    return (
        <Ctx.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </Ctx.Provider>
    );
}

export function useBuyerAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useBuyerAuth must be inside BuyerAuthProvider");
    return ctx;
}
