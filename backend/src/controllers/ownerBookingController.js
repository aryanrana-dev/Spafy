import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Salon from "../models/Salon.js";

// =====================================================
// GET ALL BOOKINGS - SALON OWNER & ADMIN
// =====================================================
export const getAllBooking = async (req, res) => {
    try {
        const isAdmin = req.user.role === "admin";
        let filter = {};

        if (isAdmin) {
            if (req.query.salonId) {
                filter.salonId = req.query.salonId;
            }
        } else {
            const salons = await Salon.find({
                ownerId: req.user._id
            }).select("_id");

            const salonIds = salons.map(salon => salon._id);
            filter.salonId = { $in: salonIds };
        }

        const bookings = await Booking.find(filter)
            .populate("userId", "name email phone")
            .populate("salonServiceId")
            .populate("salonId", "name address")
            .sort({
                appointmentDate: -1,
                startTime: -1
            });

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
// GET TODAY'S BOOKINGS - SALON OWNER & ADMIN
// =====================================================
export const getTodayBooking = async (req, res) => {
    try {
        const isAdmin = req.user.role === "admin";
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        let filter = {
            appointmentDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        };

        if (isAdmin) {
            if (req.query.salonId) {
                filter.salonId = req.query.salonId;
            }
        } else {
            const salons = await Salon.find({
                ownerId: req.user._id
            }).select("_id");

            const salonIds = salons.map(salon => salon._id);
            filter.salonId = { $in: salonIds };
        }

        const bookings = await Booking.find(filter)
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
// UPDATE BOOKING STATUS - SALON OWNER & ADMIN
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

        // Verify salon ownership unless admin
        const isAdmin = req.user.role === "admin";
        if (!isAdmin) {
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
// CANCEL BOOKING - SALON OWNER & ADMIN
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

        // Verify salon ownership unless admin
        const isAdmin = req.user.role === "admin";
        if (!isAdmin) {
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
