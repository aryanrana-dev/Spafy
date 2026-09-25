import express from "express";
import {
    getServicesBySalon,
    getServicesBySalonSlug,
    getAllServices,
    createSalonService,
    updateSalonService,
    deleteSalonService
} from "../controllers/serviceController.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { ownerOnly } from "../middleware/owner.middleware.js";

const router = express.Router();

// Public routes
router.get("/all", getAllServices);
router.get("/salon/:salonId", getServicesBySalon);
router.get("/slug/:slug", getServicesBySalonSlug);

// Owner protected routes
router.post("/", protectRoute, ownerOnly, createSalonService);
router.patch("/:id", protectRoute, ownerOnly, updateSalonService);
router.delete("/:id", protectRoute, ownerOnly, deleteSalonService);

export default router;
