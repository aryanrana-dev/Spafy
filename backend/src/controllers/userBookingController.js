
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Staff from "../models/Staff.js";
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
            staffId,
            salonServiceId,
            appointmentDate,
            startTime
        } = req.body;

        // Required fields
        if (
            !salonId ||
            !staffId ||
            !salonServiceId ||
            !appointmentDate ||
            !startTime
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate MongoDB IDs
        if (
            !mongoose.Types.ObjectId.isValid(salonId) ||
            !mongoose.Types.ObjectId.isValid(staffId) ||
            !mongoose.Types.ObjectId.isValid(salonServiceId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon, staff or service ID"
            });
        }

        // Validate dates
        const appointment = new Date(appointmentDate);
        const start = new Date(startTime);

        if (
            Number.isNaN(appointment.getTime()) ||
            Number.isNaN(start.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment date or start time"
            });
        }

        // Appointment must be in the future
        if (start <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Appointment time must be in the future"
            });
        }

        // Check salon
        const salon = await Salon.findById(salonId);

        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        // Check staff
        const staff = await Staff.findById(staffId);

        if (!staff || !staff.isActive) {
            return res.status(404).json({
                success: false,
                message: "Staff not found or inactive"
            });
        }

        // Staff must belong to this salon
        if (
            staff.salonId.toString() !==
            salonId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "Staff does not belong to this salon"
            });
        }

        // Check service
        const service = await SalonService.findById(
            salonServiceId
        );

        if (!service || !service.isActive) {
            return res.status(404).json({
                success: false,
                message: "Service not found or inactive"
            });
        }

        // Service must belong to this salon
        if (
            service.salonId.toString() !==
            salonId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "Service does not belong to this salon"
            });
        }

        // Staff must provide this service
        const providesService =
            Array.isArray(staff.servicesProvided) &&
            staff.servicesProvided.some(
                (id) =>
                    id.toString() ===
                    salonServiceId.toString()
            );

        if (!providesService) {
            return res.status(400).json({
                success: false,
                message: "Selected staff does not provide this service"
            });
        }

        // Calculate end time
        const end = calculateEndTime(
            start,
            service.durationMinutes
        );

        if (
            !end ||
            Number.isNaN(end.getTime()) ||
            end <= start
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment duration"
            });
        }

        // Check availability
        const available = await isSlotAvailable(
            staffId,
            start,
            end
        );

        if (!available) {
            return res.status(409).json({
                success: false,
                message: "Selected slot is already booked"
            });
        }

        // Create booking
        const booking = await Booking.create({
            salonId,
            userId: req.user._id,
            staffId,
            salonServiceId,
            appointmentDate: appointment,
            startTime: start,
            endTime: end,
            status: "payment_pending",
            lockExpiration: null
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
            .populate("salonId")
            .populate("staffId")
            .populate("salonServiceId")
            .sort({
                appointmentDate: -1
            });

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

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        // IMPORTANT:
        // Only search for the authenticated user's booking.
        // This prevents IDOR.
        const booking = await Booking.findOne({
            _id: id,
            userId: req.user._id
        })
            .populate("salonId")
            .populate("staffId")
            .populate("salonServiceId");

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

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        // Only find user's own booking
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

        // Cannot cancel finished bookings
        if (
            booking.status === "completed" ||
            booking.status === "cancelled" ||
            booking.status === "no_show"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Booking cannot be cancelled because it is ${booking.status}`
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
        const {
            appointmentDate,
            startTime
        } = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        // Required fields
        if (!appointmentDate || !startTime) {
            return res.status(400).json({
                success: false,
                message:
                    "Appointment date and start time are required"
            });
        }

        // Only user's own booking
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

        // Validate status
        if (
            booking.status === "completed" ||
            booking.status === "cancelled" ||
            booking.status === "no_show"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Booking cannot be rescheduled because it is ${booking.status}`
            });
        }

        // Validate new dates
        const newAppointmentDate =
            new Date(appointmentDate);

        const newStart = new Date(startTime);

        if (
            Number.isNaN(newAppointmentDate.getTime()) ||
            Number.isNaN(newStart.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid appointment date or start time"
            });
        }

        // New appointment must be future
        if (newStart <= new Date()) {
            return res.status(400).json({
                success: false,
                message:
                    "New appointment time must be in the future"
            });
        }

        // Get existing service
        const service = await SalonService.findById(
            booking.salonServiceId
        );

        if (!service || !service.isActive) {
            return res.status(400).json({
                success: false,
                message:
                    "Booking service is no longer available"
            });
        }

        // Calculate new end time
        const newEnd = calculateEndTime(
            newStart,
            service.durationMinutes
        );

        if (
            !newEnd ||
            Number.isNaN(newEnd.getTime()) ||
            newEnd <= newStart
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid appointment duration"
            });
        }

        // Check availability
        // Current booking is excluded
        const available = await isSlotAvailable(
            booking.staffId,
            newStart,
            newEnd,
            booking._id
        );

        if (!available) {
            return res.status(409).json({
                success: false,
                message:
                    "Selected slot is already booked"
            });
        }

        // Update
        booking.appointmentDate =
            newAppointmentDate;

        booking.startTime = newStart;
        booking.endTime = newEnd;

        booking.status = "payment_pending";
        booking.lockExpiration = null;

        await booking.save();

        return res.status(200).json({
            success: true,
            message:
                "Booking rescheduled successfully",
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
        const {
            staffId,
            salonServiceId,
            startTime
        } = req.body;

        // Required fields
        if (
            !staffId ||
            !salonServiceId ||
            !startTime
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Staff, service and start time are required"
            });
        }

        // Validate IDs
        if (
            !mongoose.Types.ObjectId.isValid(staffId) ||
            !mongoose.Types.ObjectId.isValid(salonServiceId)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid staff or service ID"
            });
        }

        // Validate time
        const start = new Date(startTime);

        if (Number.isNaN(start.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid start time"
            });
        }

        if (start <= new Date()) {
            return res.status(400).json({
                success: false,
                message:
                    "Start time must be in the future"
            });
        }

        // Check staff
        const staff = await Staff.findById(staffId);

        if (!staff || !staff.isActive) {
            return res.status(404).json({
                success: false,
                message:
                    "Staff not found or inactive"
            });
        }

        // Check service
        const service =
            await SalonService.findById(
                salonServiceId
            );

        if (!service || !service.isActive) {
            return res.status(404).json({
                success: false,
                message:
                    "Service not found or inactive"
            });
        }

        // Staff and service must belong
        // to the same salon
        if (
            staff.salonId.toString() !==
            service.salonId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Staff and service do not belong to the same salon"
            });
        }

        // Staff must provide service
        const providesService =
            Array.isArray(staff.servicesProvided) &&
            staff.servicesProvided.some(
                (id) =>
                    id.toString() ===
                    salonServiceId.toString()
            );

        if (!providesService) {
            return res.status(400).json({
                success: false,
                message:
                    "Selected staff does not provide this service"
            });
        }

        // Calculate end time
        const end = calculateEndTime(
            start,
            service.durationMinutes
        );

        if (
            !end ||
            Number.isNaN(end.getTime()) ||
            end <= start
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid appointment duration"
            });
        }

        // Check availability
        const available =
            await isSlotAvailable(
                staffId,
                start,
                end
            );

        return res.status(200).json({
            success: true,
            available,
            startTime: start,
            endTime: end
        });

    } catch (error) {
        console.error(
            "Check slot availability error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
