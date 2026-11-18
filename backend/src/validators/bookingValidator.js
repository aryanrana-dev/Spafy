import { z } from "zod";

const objectId = z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

// Create Booking Validator
export const createBookingSchema = z.object({
    body: z.object({
        salonId: objectId,
        salonServiceId: objectId.optional(),
        services: z.array(objectId).optional(),
        appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid appointment date"
        }),
        startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid start time"
        })
    }).refine((data) => data.salonServiceId || (data.services && data.services.length > 0), {
        message: "At least one service is required for booking"
    })
});

// Check Slot Validator
export const checkSlotSchema = z.object({
    body: z.object({
        salonId: objectId,
        salonServiceId: objectId,
        startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid start time"
        })
    })
});

// Reschedule Booking Validator
export const rescheduleBookingSchema = z.object({
    params: z.object({
        id: objectId
    }),
    body: z.object({
        appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid appointment date"
        }),
        startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid start time"
        })
    })
});

// Update Booking Status Validator (Owner)
export const updateBookingStatusSchema = z.object({
    params: z.object({
        id: objectId
    }),
    body: z.object({
        status: z.enum(["confirmed", "completed", "cancelled", "no_show"])
    })
});