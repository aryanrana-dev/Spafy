
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import SalonService from "../models/SalonService.js";
import Salon from "../models/Salon.js";

import {
    calculateEndTime,
    isSlotAvailable
} from "../services/bookService.js";


// =====================================================
// CREATE BOOKING
// =====================================================

export const createBooking = async (req, res) => {
    try {
        const {
            salonId,
            salonServiceId,
            appointmentDate,
            startTime
        } = req.body;

        if (!salonId || !salonServiceId || !appointmentDate || !startTime) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(salonId) ||
            !mongoose.Types.ObjectId.isValid(salonServiceId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon or service ID"
            });
        }

        const appointment = new Date(appointmentDate);
        const start = new Date(startTime);

        if (
            Number.isNaN(appointment.getTime()) ||
            Number.isNaN(start.getTime()) ||
            start <= new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid or past appointment time"
            });
        }

        const salon = await Salon.findOne({
            _id: salonId,
            isActive: true
        }).select("_id");

        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        const service = await SalonService.findOne({
            _id: salonServiceId,
            salonId,
            isActive: true
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        const end = calculateEndTime(
            start,
            service.durationMinutes
        );

        if (!end || end <= start) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment duration"
            });
        }

        const available = await isSlotAvailable(
            salonId,
            start,
            end
        );

        if (!available) {
            return res.status(409).json({
                success: false,
                message: "Selected slot is already booked"
            });
        }

        // 15-minute lock while customer completes payment
        const lockExpiration = new Date(Date.now() + 15 * 60 * 1000);

        const booking = await Booking.create({
            salonId,
            userId: req.user._id,
            salonServiceId,
            services: [salonServiceId],
            totalAmount: service.price,
            appointmentDate: appointment,
            startTime: start,
            endTime: end,
            status: "payment_pending",
            lockExpiration
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// GET MY BOOKINGS
// =====================================================

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.user._id
        })
            .populate("salonId", "name address")
            .populate("salonServiceId", "price durationMinutes")
            .sort({ appointmentDate: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get my bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// GET BOOKING BY ID
// =====================================================

export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        const booking = await Booking.findOne({
            _id: id,
            userId: req.user._id
        })
            .populate("salonId", "name address")
            .populate("salonServiceId", "price durationMinutes");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        console.error("Get booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// CANCEL BOOKING
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

        const booking = await Booking.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (
            booking.status === "completed" ||
            booking.status === "cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: "Booking cannot be cancelled"
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


// =====================================================
// RESCHEDULE BOOKING
// =====================================================

export const rescheduleBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { appointmentDate, startTime } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        if (!appointmentDate || !startTime) {
            return res.status(400).json({
                success: false,
                message: "Appointment date and start time are required"
            });
        }

        const booking = await Booking.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (
            booking.status === "completed" ||
            booking.status === "cancelled" ||
            booking.status === "no_show"
        ) {
            return res.status(400).json({
                success: false,
                message: "Booking cannot be rescheduled"
            });
        }

        const appointment = new Date(appointmentDate);
        const start = new Date(startTime);

        if (
            Number.isNaN(appointment.getTime()) ||
            Number.isNaN(start.getTime()) ||
            start <= new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid or past appointment time"
            });
        }

        const service = await SalonService.findOne({
            _id: booking.salonServiceId,
            salonId: booking.salonId,
            isActive: true
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        const end = calculateEndTime(
            start,
            service.durationMinutes
        );

        const available = await isSlotAvailable(
            booking.salonId,
            start,
            end,
            booking._id
        );

        if (!available) {
            return res.status(409).json({
                success: false,
                message: "Selected slot is already booked"
            });
        }

        booking.appointmentDate = appointment;
        booking.startTime = start;
        booking.endTime = end;

        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking rescheduled successfully",
            booking
        });

    } catch (error) {
        console.error("Reschedule booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// CHECK SLOT AVAILABILITY
// =====================================================

export const checkSlotAvailability = async (req, res) => {
    try {
        const salonId = req.body?.salonId || req.query?.salonId;
        const startTime = req.body?.startTime || req.query?.startTime;
        const salonServiceId = req.body?.salonServiceId || req.query?.salonServiceId;

        if (!salonId || !startTime || !salonServiceId) {
            return res.status(400).json({
                success: false,
                message: "Salon, service and start time are required"
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(salonId) ||
            !mongoose.Types.ObjectId.isValid(salonServiceId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon or service ID"
            });
        }

        const start = new Date(startTime);

        if (Number.isNaN(start.getTime()) || start <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or past start time"
            });
        }

        const service = await SalonService.findOne({
            _id: salonServiceId,
            salonId,
            isActive: true
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        const end = calculateEndTime(
            start,
            service.durationMinutes
        );

        const available = await isSlotAvailable(
            salonId,
            start,
            end
        );

        return res.status(200).json({
            success: true,
            available
        });

    } catch (error) {
        console.error("Check slot availability error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
