import express from "express";

import {
    createSalon,
    getAllSalons,
    getSalonById,
    getMySalons,
    updateSalon,
    deleteSalon
} from "../controllers/salonController.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { ownerOnly } from "../middleware/owner.middleware.js";
import { fetchSalonService } from "../controllers/salon.js";

const router = express.Router();


// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all active salons
router.get("/", getAllSalons);

router.get("/fetch-services", fetchSalonService);

// Get salons owned by logged-in owner
// This must come before /:id
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


// =====================================================
// EXPORT ROUTER
// =====================================================

export default router;