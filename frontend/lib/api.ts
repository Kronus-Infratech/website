/**
 * Centralized API client for Kronus backend.
 * - No hardcoded URLs — reads from NEXT_PUBLIC_API_URL env var
 * - Automatically attaches access token from in-memory store
 * - Handles 401 → silent token refresh → retry
 * - Returns typed { success, message, data, meta } responses
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
    errors?: { field: string; message: string }[];
}

// ─── In-memory token store (never touches localStorage) ───

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

// ─── Core fetch wrapper ───

interface FetchOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
    skipAuth?: boolean;
}

async function request<T = unknown>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<ApiResponse<T>> {
    const { body, skipAuth = false, headers: extraHeaders, ...rest } = options;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(extraHeaders as Record<string, string>),
    };

    if (!skipAuth && accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
        credentials: "include", // send httpOnly refresh cookie
        ...rest,
        headers,
    };

    if (body !== undefined) {
        config.body = JSON.stringify(body);
    }

    let response = await fetch(`${API_URL}${endpoint}`, config);

    // If 401 and we had a token, attempt silent refresh
    if (response.status === 401 && accessToken && !skipAuth) {
        const refreshed = await refreshTokens();
        if (refreshed) {
            headers["Authorization"] = `Bearer ${accessToken}`;
            config.headers = headers;
            response = await fetch(`${API_URL}${endpoint}`, config);
        }
    }

    // 204 No Content
    if (response.status === 204) {
        return { success: true, message: "Success" };
    }

    const json: ApiResponse<T> = await response.json();

    if (!response.ok) {
        throw new ApiError(json.message, response.status, json.errors);
    }

    return json;
}

// ─── Token refresh ───

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
    // Deduplicate concurrent refresh calls
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                accessToken = null;
                return false;
            }

            const json: ApiResponse<{ accessToken: string }> = await res.json();
            if (json.data?.accessToken) {
                accessToken = json.data.accessToken;
                return true;
            }
            return false;
        } catch {
            accessToken = null;
            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

// ─── Custom error class ───

export class ApiError extends Error {
    public status: number;
    public errors?: { field: string; message: string }[];

    constructor(message: string, status: number, errors?: { field: string; message: string }[]) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }

    /** Get the error message for a specific field */
    fieldError(field: string): string | undefined {
        return this.errors?.find((e) => e.field === field)?.message;
    }
}

// ─── HTTP method shortcuts ───

export const api = {
    get: <T = unknown>(endpoint: string, options?: FetchOptions) =>
        request<T>(endpoint, { ...options, method: "GET" }),

    post: <T = unknown>(endpoint: string, body?: unknown, options?: FetchOptions) =>
        request<T>(endpoint, { ...options, method: "POST", body }),

    put: <T = unknown>(endpoint: string, body?: unknown, options?: FetchOptions) =>
        request<T>(endpoint, { ...options, method: "PUT", body }),

    patch: <T = unknown>(endpoint: string, body?: unknown, options?: FetchOptions) =>
        request<T>(endpoint, { ...options, method: "PATCH", body }),

    delete: <T = unknown>(endpoint: string, options?: FetchOptions) =>
        request<T>(endpoint, { ...options, method: "DELETE" }),
};
