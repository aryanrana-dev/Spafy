import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";
import Unauthorized from "../pages/unauthorized";

/**
 * RoleProtectedRoute Component
 * Enforces authentication and role-based permissions on routes.
 *
 * Roles:
 * - 'user': Can only access salon services, bookings, profile, checkout
 * - 'salon': Can only access salon dashboard (/:salonName/dashboard)
 * - 'admin': Can access everything
 *
 * @param {Array<string>} allowedRoles - Roles permitted to view this route (e.g. ['user', 'admin'])
 * @param {boolean} allowPublic - Whether unauthenticated guests may view (e.g. salon browsing)
 * @param {string} redirectTo - Optional custom path to redirect forbidden users
 * @param {React.ReactNode} children - The component to render if authorized
 */
export default function RoleProtectedRoute({
    allowedRoles = [],
    allowPublic = false,
    redirectTo = null,
    children
}) {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    // Rehydrate backup from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUserRaw = localStorage.getItem("user");
    let storedUser = null;
    try {
        if (storedUserRaw) storedUser = JSON.parse(storedUserRaw);
    } catch (e) {
        storedUser = null;
    }

    const isAuthed = isAuthenticated || Boolean(storedToken && (user || storedUser));
    const currentUser = user || storedUser;

    const rawRole = currentUser?.role;
    const userRole = (rawRole === "owner" ? "salon" : rawRole) || "user";

    // Unauthenticated access handling
    if (!isAuthed) {
        if (allowPublic) {
            return children;
        }
        return <Navigate to="/salon/login" state={{ from: location.pathname }} replace />;
    }

    // Admin has superuser access to everything
    if (userRole === "admin") {
        return children;
    }

    // Normalize allowed roles
    const normalizedAllowed = allowedRoles.map((r) => (r === "owner" ? "salon" : r));

    // Check if current user's role is permitted
    if (normalizedAllowed.includes(userRole)) {
        return children;
    }

    // Role is not allowed
    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Unauthorized requiredRoles={normalizedAllowed} />;
}

