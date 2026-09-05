import { z } from "zod";

// MongoDB ObjectId validation
const objectId = z
    .string()
    .trim()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid MongoDB ID"
    );


// Create Salon Service
export const createSalonServiceSchema = z.object({

    body: z.object({

        salonId: objectId,

        masterServiceId: objectId,

        price: z
            .number()
            .positive("Price must be greater than 0")
            .max(100000, "Price cannot exceed 100000"),

        durationMinutes: z
            .number()
            .int("Duration must be a whole number")
            .positive("Duration must be greater than 0")
            .max(1440, "Duration cannot exceed 24 hours"),

        isActive: z
            .boolean()
            .optional()

    }).strict(),

    params: z.object({}).strict(),

    query: z.object({}).strict()

});