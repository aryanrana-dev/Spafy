import { create } from "zustand";
import api from "../api/axiosClient";

const normalizeRole = (role) => {
    if (!role) return "user";
    const lower = String(role).toLowerCase().trim();
    if (lower === "owner") return "salon";
    return lower;
};

export const useAuthStore = create((set, get) => ({
    user: (() => {
        try {
            const raw = localStorage.getItem("user");
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.role) {
                parsed.role = normalizeRole(parsed.role);
            }
            return parsed;
        } catch (e) {
            return null;
        }
    })(),
    isAuthenticated: !!localStorage.getItem("token") || !!localStorage.getItem("user"),
    isLoading: false,
    error: null,
    clearError: () => set({ error: null }),

    setUser: (user) => {
        if (user) {
            const normalized = {
                ...user,
                role: normalizeRole(user.role)
            };
            localStorage.setItem("user", JSON.stringify(normalized));
            if (user.token) localStorage.setItem("token", user.token);
            set({ user: normalized, isAuthenticated: true, error: null });
        } else {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            set({ user: null, isAuthenticated: false, error: null });
        }
    },

    initAuthFromUrl: () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
            const rawRole = params.get("role") || "user";
            const role = normalizeRole(rawRole);
            const salonSlug = params.get("salonSlug") || (role === "salon" ? "spafy" : null);

            const user = {
                _id: params.get("userId"),
                fullName: decodeURIComponent(params.get("fullName") || "Client"),
                email: decodeURIComponent(params.get("email") || ""),
                role,
                salonSlug,
                token
            };
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            set({ user, isAuthenticated: true, error: null });
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
        }
        return false;
    },

    checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            set({ user: null, isAuthenticated: false });
            return null;
        }
        try {
            const { data } = await api.get("/auth/me");
            if (data?.success && data?.user) {
                const updatedUser = {
                    ...get().user,
                    ...data.user,
                    role: normalizeRole(data.user.role),
                    token
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                set({ user: updatedUser, isAuthenticated: true });
                return updatedUser;
            }
            return null;
        } catch (err) {
            // Token may have expired or is invalid
            if (err.response?.status === 401) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                set({ user: null, isAuthenticated: false });
            }
            return null;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post("/auth/login", { email, password });
            const normalized = {
                ...data,
                role: normalizeRole(data.role)
            };
            localStorage.setItem("user", JSON.stringify(normalized));
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            set({ user: normalized, isAuthenticated: true, isLoading: false, error: null });
            return { success: true, user: normalized };
        } catch (err) {
            const message = err.response?.data?.message || "Login failed. Please check credentials.";
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    signup: async (fullName, email, password, role = "user", adminSecret = "") => {
        set({ isLoading: true, error: null });
        try {
            const payload = {
                fullName,
                email,
                password,
                role: normalizeRole(role)
            };
            if (adminSecret) {
                payload.adminSecret = adminSecret;
            }
            const { data } = await api.post("/auth/signup", payload);
            const normalized = {
                ...data,
                role: normalizeRole(data.role)
            };
            localStorage.setItem("user", JSON.stringify(normalized));
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            set({ user: normalized, isAuthenticated: true, isLoading: false, error: null });
            return { success: true, user: normalized };
        } catch (err) {
            const message = err.response?.data?.message || "Signup failed.";
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
        } catch (e) {
            console.error("Logout error", e);
        }
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        set({ user: null, isAuthenticated: false, error: null });
    }
}));
