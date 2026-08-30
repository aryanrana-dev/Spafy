
import mongoose from "mongoose";
import Booking from "../models/Booking.js";


// CALCULATE END TIME


export const calculateEndTime = (startTime, durationMinutes) => {
    const start = new Date(startTime);

    if (
        Number.isNaN(start.getTime()) ||
        !Number.isFinite(Number(durationMinutes)) ||
        Number(durationMinutes) <= 0
    ) {
        return null;
    }

    return new Date(
        start.getTime() + Number(durationMinutes) * 60 * 1000
    );
};


// =====================================================
// CHECK SLOT AVAILABILITY
// =====================================================

export const isSlotAvailable = async (
    staffId,
    startTime,
    endTime,
    excludeBookingId = null
) => {

    if (!mongoose.Types.ObjectId.isValid(staffId)) {
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
        staffId,
        status: {
            $in: ["payment_pending", "confirmed"]
        },

        // Overlap condition:
        // existing.start < requested.end
        startTime: {
            $lt: end
        },

        // existing.end > requested.start
        endTime: {
            $gt: start
        }
    };

    // Used during rescheduling
    // so the current booking doesn't conflict with itself
    if (excludeBookingId) {

        if (!mongoose.Types.ObjectId.isValid(excludeBookingId)) {
            return false;
        }

        query._id = {
            $ne: excludeBookingId
        };
    }

    const booking = await Booking
        .findOne(query)
        .select("_id")
        .lean();

    return !booking;
};
