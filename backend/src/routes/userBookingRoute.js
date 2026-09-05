
import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

import {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    checkSlotAvailability,
    rescheduleBooking
} from "../controllers/userBookingController.js";

const router = express.Router();

// All user booking routes require authentication
router.use(protectRoute);

// Create booking
router.post("/book", createBooking);

// Get logged-in user's bookings
router.get("/my-bookings", getMyBookings);

// Get one of the logged-in user's bookings
router.get("/:id", getBookingById);

// Cancel user's own booking
router.patch("/cancel/:id", cancelBooking);

// Check slot availability
router.post("/check-slot", checkSlotAvailability);

// Reschedule user's own booking
router.patch("/reschedule/:id", rescheduleBooking);

export default router;
