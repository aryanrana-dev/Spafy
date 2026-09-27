
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Salon from "../models/Salon.js";


// GET ALL BOOKINGS - SALON OWNER


export const getAllBooking = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
        const skip = (pageNum - 1) * limitNum;

        const salons = await Salon.find({
            ownerId: req.user._id
        }).select("_id");

        const salonIds = salons.map(salon => salon._id);

        const filter = {
            salonId: { $in: salonIds }
        };

        if (status) {
            filter.status = status;
        }

        const [bookings, total] = await Promise.all([
            Booking.find(filter)
                .populate("userId", "name email phone")
                .populate("salonServiceId")
                .populate("services")
                .populate("salonId", "name address")
                .sort({
                    appointmentDate: -1,
                    startTime: -1
                })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Booking.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            count: bookings.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
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
        const salons = await Salon.find({
            ownerId: req.user._id
        }).select("_id");

        const salonIds = salons.map(salon => salon._id);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const bookings = await Booking.find({
            salonId: { $in: salonIds },
            appointmentDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        })
            .populate("userId", "name email phone")
            .populate("salonServiceId")
            .populate("salonId", "name address")
            .sort({ startTime: 1 });

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

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

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

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

        // Final states cannot be changed
        if (
            booking.status === "completed" ||
            booking.status === "cancelled" ||
            booking.status === "no_show"
        ) {
            return res.status(400).json({
                success: false,
                message: "This booking can no longer be changed"
            });
        }

        booking.status = status;
        booking.lockExpiration = null;

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

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

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
                message: "You are not authorized to cancel this booking"
            });
        }

        // Booking history should not be changed
        if (
            booking.status === "completed" ||
            booking.status === "cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: "This booking cannot be cancelled"
            });
        }

        booking.status = "cancelled";
        booking.lockExpiration = null;

        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        console.error("Cancel booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};