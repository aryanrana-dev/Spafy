import { z } from "zod";

const objectId = z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

// Create Review Validator
export const createReviewSchema = z.object({
    body: z.object({
        bookingId: objectId,
        salonId: objectId.optional(),
        rating: z
            .number({ required_error: "Rating is required" })
            .int("Rating must be a whole number")
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot exceed 5"),
        comment: z
            .string()
            .trim()
            .max(1000, "Comment cannot exceed 1000 characters")
            .optional()
    })
});