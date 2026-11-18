import express from "express";

import {
    createSalon,
    getAllSalons,
    getSalonById,
    getSalonBySlug,
    getMySalons,
    updateSalon,
    deleteSalon
} from "../controllers/salonController.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { ownerOnly } from "../middleware/owner.middleware.js";
import { getAllServices } from "../controllers/serviceController.js";

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all active salons
router.get("/", getAllSalons);

// Legacy service fetch route
router.get("/fetch-services", getAllServices);

// Get salon by slug
router.get("/slug/:slug", getSalonBySlug);

// Get salons owned by logged-in owner
router.get(
    "/my-salons",
    protectRoute,
    ownerOnly,
    getMySalons
);

// Get single salon by ID
router.get("/:id", getSalonById);

// =====================================================
// OWNER ROUTES
// =====================================================

// Create a new salon
router.post(
    "/",
    protectRoute,
    ownerOnly,
    createSalon
);

// Update salon
router.patch(
    "/:id",
    protectRoute,
    ownerOnly,
    updateSalon
);

// Soft delete salon
router.delete(
    "/:id",
    protectRoute,
    ownerOnly,
    deleteSalon
);

export default router;