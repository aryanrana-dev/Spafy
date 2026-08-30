
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Salon from "../models/Salon.js";


// GET ALL BOOKINGS - SALON OWNER


export const getAllBooking = async (req, res) => {
    try {
        // Find salons owned by logged-in user
        const salons = await Salon.find({
            ownerId: req.user._id
        }).select("_id");

        if (salons.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                bookings: []
            });
        }

        const salonIds = salons.map((salon) => salon._id);

        // Only bookings from owner's salons
        const bookings = await Booking.find({
            salonId: { $in: salonIds }
        })
            .populate("userId", "-password")
            .populate("staffId")
            .populate("salonServiceId")
            .populate("salonId")
            .sort({
                appointmentDate: -1,
                startTime: -1
            });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get all bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// GET TODAY'S BOOKINGS - SALON OWNER
// =====================================================

export const getTodayBooking = async (req, res) => {
    try {
        // Find salons owned by logged-in user
        const salons = await Salon.find({
            ownerId: req.user._id
        }).select("_id");

        if (salons.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                bookings: []
            });
        }

        const salonIds = salons.map((salon) => salon._id);

        // Start of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Start of tomorrow
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const bookings = await Booking.find({
            salonId: { $in: salonIds },

            appointmentDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        })
            .populate("userId", "-password")
            .populate("staffId")
            .populate("salonServiceId")
            .populate("salonId")
            .sort({
                startTime: 1
            });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get today's bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// UPDATE BOOKING STATUS - SALON OWNER
// =====================================================

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate booking ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        // Validate status
        const allowedStatuses = [
            "confirmed",
            "completed",
            "cancelled",
            "no_show"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status"
            });
        }

        // Find booking
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Verify salon ownership
        const salon = await Salon.findOne({
            _id: booking.salonId,
            ownerId: req.user._id
        }).select("_id");

        if (!salon) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to manage this booking"
            });
        }

        // Prevent invalid state transitions
        if (booking.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Completed booking cannot be changed"
            });
        }

        if (
            booking.status === "cancelled" &&
            status !== "cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: "Cancelled booking cannot be reopened"
            });
        }

        if (
            booking.status === "no_show" &&
            status !== "no_show"
        ) {
            return res.status(400).json({
                success: false,
                message: "No-show booking cannot be changed"
            });
        }

        // Update status
        booking.status = status;

        // Remove payment lock when booking
        // is no longer payment_pending
        if (status !== "payment_pending") {
            booking.lockExpiration = null;
        }

        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            booking
        });

    } catch (error) {
        console.error("Update booking status error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// DELETE / CANCEL BOOKING - SALON OWNER
// =====================================================

export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        // Find booking
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Verify salon ownership
        const salon = await Salon.findOne({
            _id: booking.salonId,
            ownerId: req.user._id
        }).select("_id");

        if (!salon) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this booking"
            });
        }

        // Do not physically delete booking history
        if (booking.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Completed booking cannot be deleted"
            });
        }

        // Soft cancel instead of deleting
        booking.status = "cancelled";
        booking.lockExpiration = null;

        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        console.error("Delete booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
