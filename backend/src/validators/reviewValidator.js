import { z } from "zod";

// =====================================================
// COMMON MONGODB OBJECT ID VALIDATION
// =====================================================

const objectId = z
    .string()
    .trim()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid MongoDB ID"
    );


// =====================================================
// CREATE REVIEW VALIDATION
// =====================================================

export const createReviewSchema = z.object({

    body: z.object({

        // Salon being reviewed
        salonId: objectId,

        // Booking associated with this review
        bookingId: objectId,

        // Rating from 1 to 5
        rating: z
            .number()
            .int("Rating must be a whole number")
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot be greater than 5"),

        // Optional review comment
        comment: z
            .string()
            .trim()
            .max(
                1000,
                "Comment cannot exceed 1000 characters"
            )
            .optional()

    }).strict(),

    params: z.object({}).strict(),

    query: z.object({}).strict()

});