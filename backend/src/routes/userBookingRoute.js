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

// Check slot availability (placed before /:id)
router.post("/check-slot", checkSlotAvailability);

// Cancel user's own booking
router.patch("/cancel/:id", cancelBooking);

// Reschedule user's own booking
router.patch("/reschedule/:id", rescheduleBooking);

// Get one of the logged-in user's bookings
router.get("/:id", getBookingById);

export default router;
