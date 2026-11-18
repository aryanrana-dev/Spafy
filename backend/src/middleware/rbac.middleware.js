/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Defines and enforces permissions across 3 primary roles:
 * 1. 'user': Can only access salon browsing, own bookings, profile, and checkout
 * 2. 'salon': Can only access the salon partner dashboard (/:salonName/dashboard) & owner APIs
 * 3. 'admin': Superuser privileges with access to everything
 */

export const normalizeRole = (role) => {
    if (!role) return "user";
    const lower = String(role).toLowerCase().trim();
    if (lower === "owner") return "salon";
    return lower;
};

/**
 * Middleware factory to authorize specific roles.
 * Must be mounted after `protectRoute`.
 *
 * @param  {...string} allowedRoles - List of permitted roles (e.g. 'user', 'salon', 'admin')
 */
export const authorizeRoles = (...allowedRoles) => {
    const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));

    return (req, res, next) => {
        // Ensure authentication middleware ran first
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Authentication required"
            });
        }

        const userRole = normalizeRole(req.user.role);

        // Admin has absolute superuser access to everything
        if (userRole === "admin") {
            return next();
        }

        // Check if user's role is permitted
        if (!normalizedAllowed.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access denied. Role '${userRole}' is not authorized to access this resource`,
                currentRole: userRole,
                requiredRoles: normalizedAllowed
            });
        }

        next();
    };
};

export const requireAdmin = authorizeRoles("admin");
export const requireSalon = authorizeRoles("salon", "admin");
export const requireUser = authorizeRoles("user", "admin");

