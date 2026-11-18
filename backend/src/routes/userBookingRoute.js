import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    checkSlotAvailability,
    rescheduleBooking
} from "../controllers/userBookingController.js";

const router = express.Router();

// Public slot availability check route (supports both GET and POST)
router.get("/check-slot", checkSlotAvailability);
router.post("/check-slot", checkSlotAvailability);

// All user booking mutations & viewing endpoints require authentication
// Role restriction: 'user' can access their bookings, 'admin' has full access.
// 'salon' role cannot access user booking pages/APIs.
router.use(protectRoute);
router.use(authorizeRoles("user", "admin"));

// Create booking
router.post("/book", createBooking);

// Get logged-in user's bookings
router.get("/my-bookings", getMyBookings);

// Get one of the logged-in user's bookings (admin can get any)
router.get("/:id", getBookingById);

// Cancel user's own booking (admin can cancel any)
router.patch("/cancel/:id", cancelBooking);

// Reschedule user's own booking (admin can reschedule any)
router.patch("/reschedule/:id", rescheduleBooking);

export default router;
