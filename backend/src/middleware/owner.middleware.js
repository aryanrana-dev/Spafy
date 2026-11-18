import { authorizeRoles } from "./rbac.middleware.js";

/**
 * ownerOnly middleware
 * Backward-compatible wrapper allowing 'salon', 'owner', and 'admin' roles.
 */
export const ownerOnly = authorizeRoles("salon", "admin");

export default ownerOnly;
