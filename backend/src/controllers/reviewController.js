import mongoose from "mongoose";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

// =====================================================
// CREATE REVIEW - USER ONLY
// =====================================================
export const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;

        if (!bookingId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Booking ID and rating are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        const ratingNum = Number(rating);
        if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Verify booking belongs to user and is completed
        const booking = await Booking.findOne({
            _id: bookingId,
            userId: req.user._id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found or does not belong to you"
            });
        }

        if (booking.status !== "completed") {
            return res.status(400).json({
                success: false,
                message: "You can only review completed appointments"
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "A review has already been submitted for this booking"
            });
        }

        const review = await Review.create({
            salonId: booking.salonId,
            userId: req.user._id,
            bookingId: booking._id,
            rating: Math.round(ratingNum),
            comment: comment ? comment.trim() : ""
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review
        });

    } catch (error) {
        console.error("Create review error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// GET SALON REVIEWS - PUBLIC
// =====================================================
export const getSalonReviews = async (req, res) => {
    try {
        const { salonId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(salonId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon ID"
            });
        }

        const reviews = await Review.find({ salonId })
            .populate("userId", "name profilePic")
            .sort({ createdAt: -1 })
            .lean();

        // Calculate average rating
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        return res.status(200).json({
            success: true,
            count: reviews.length,
            averageRating: Number(averageRating),
            reviews
        });

    } catch (error) {
        console.error("Get salon reviews error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
