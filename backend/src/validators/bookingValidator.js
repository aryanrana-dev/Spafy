import { z } from "zod";

// =====================================================
// COMMON OBJECT ID VALIDATION
// =====================================================

const objectId = z
    .string()
    .trim()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid MongoDB ID"
    );


// =====================================================
// ISO DATE VALIDATION
// =====================================================

const dateTime = z
    .string()
    .datetime({
        offset: true,
        message: "Invalid date and time"
    });


// =====================================================
// CREATE BOOKING VALIDATION
// =====================================================

export const createBookingSchema = z.object({

    body: z.object({

        // Salon selected by the customer
        salonId: objectId,

        // Salon service selected by the customer
        salonServiceId: objectId,

        // Appointment date
        appointmentDate: dateTime,

        // Requested appointment start time
        startTime: dateTime

    }).strict(),

    // No route parameters for create booking
    params: z.object({}).strict(),

    // No query parameters for create booking
    query: z.object({}).strict()

});