import React from "react";
import RoleProtectedRoute from "./role-protected-route";

/**
 * ProtectedRoute Component (Legacy Wrapper)
 * Defaults to allowing authenticated 'user' and 'admin' roles.
 */
export default function ProtectedRoute({
    allowedRoles = ["user", "admin"],
    allowPublic = false,
    children
}) {
    return (
        <RoleProtectedRoute allowedRoles={allowedRoles} allowPublic={allowPublic}>
            {children}
        </RoleProtectedRoute>
    );
}
