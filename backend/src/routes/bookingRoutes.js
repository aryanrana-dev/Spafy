import express from "express";
 const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getAllBooking,
  getTodayBooking,
  checkSlotAvailability,
  rescheduleBooking,
  deleteBooking,
} from "../controllers/bookingController.js";




// All routes below require login
router.use(protectRoute);

router.post("/book", createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/:id", getBookingById);
router.patch("/cancel/:id", cancelBooking);
router.patch("/status/:id", updateBookingStatus);
router.get("/all", getAllBooking);
router.get("/today", getTodayBooking);
router.post("/check-slot", checkSlotAvailability);
router.patch("/reschedule/:id", rescheduleBooking);
router.delete("/:id", deleteBooking);

export default router;
