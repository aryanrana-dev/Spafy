import express from "express";

import {
    getAllBooking,
    getTodayBooking,
    updateBookingStatus,
    cancelBooking
} from "../controllers/ownerBookingController.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { ownerOnly } from "../middleware/owner.middleware.js";

const router = express.Router();

// All routes below require authentication + owner role
router.use(protectRoute);
router.use(ownerOnly);

router.get("/all", getAllBooking);

router.get("/today", getTodayBooking);

router.patch("/:id/status", updateBookingStatus);

router.patch("/:id/cancel", cancelBooking);

export default router;