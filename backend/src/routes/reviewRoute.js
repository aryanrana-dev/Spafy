import express from "express";
import { createReview, getSalonReviews } from "../controllers/reviewController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public: get salon reviews
router.get("/salon/:salonId", getSalonReviews);

// Protected: create review for completed booking
router.post("/", protectRoute, createReview);

export default router;
