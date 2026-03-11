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

interface AdminUser {
    id: string;
    name: string;
    email: string;
    roles: string[];
}

interface AdminAuthCtx {
    user: AdminUser | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const Ctx = createContext<AdminAuthCtx | null>(null);

const STORAGE_KEY = "kronus_admin_token";
const USER_KEY = "kronus_admin_user";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
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
        const res = await api.post<{ token: string; user: AdminUser }>(
            "/admin/login",
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

    const logout = useCallback(() => {
        setAccessToken(null);
        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
    }, []);

    return (
        <Ctx.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </Ctx.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
    return ctx;
}
