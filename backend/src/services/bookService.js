import mongoose from "mongoose";
import Booking from "../models/Booking.js";


// =====================================================
// CALCULATE END TIME
// =====================================================

export const calculateEndTime = (startTime, durationMinutes) => {

    const start = new Date(startTime);
    const duration = Number(durationMinutes);

    if (
        Number.isNaN(start.getTime()) ||
        !Number.isFinite(duration) ||
        duration <= 0
    ) {
        return null;
    }

    return new Date(
        start.getTime() + duration * 60 * 1000
    );
};


// =====================================================
// CHECK SLOT AVAILABILITY
// =====================================================

export const isSlotAvailable = async (
    salonId,
    startTime,
    endTime,
    excludeBookingId = null
) => {

    if (!mongoose.Types.ObjectId.isValid(salonId)) {
        return false;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end <= start
    ) {
        return false;
    }

    const query = {
        salonId,

        status: {
            $in: ["payment_pending", "confirmed"]
        },

        // Existing booking starts before requested booking ends
        startTime: {
            $lt: end
        },

        // Existing booking ends after requested booking starts
        endTime: {
            $gt: start
        }
    };

    // Used during rescheduling
    // Ignore the current booking itself
    if (excludeBookingId) {

        if (!mongoose.Types.ObjectId.isValid(excludeBookingId)) {
            return false;
        }

        query._id = {
            $ne: excludeBookingId
        };
    }

    const conflictingBooking = await Booking
        .findOne(query)
        .select("_id")
        .lean();

    return !conflictingBooking;
};