import { z } from "zod";

const objectId = z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

// Create Salon Service
export const createSalonServiceSchema = z.object({
    body: z.object({
        salonId: objectId,
        name: z.string({ required_error: "Service name is required" }).trim().min(2).max(100),
        masterServiceId: objectId.optional(),
        price: z
            .number({ required_error: "Price is required" })
            .positive("Price must be greater than 0")
            .max(100000, "Price cannot exceed 100000"),
        durationMinutes: z
            .number({ required_error: "Duration is required" })
            .int("Duration must be a whole number")
            .positive("Duration must be greater than 0")
            .max(1440, "Duration cannot exceed 24 hours"),
        isActive: z.boolean().optional()
    })
});

// Update Salon Service
export const updateSalonServiceSchema = z.object({
    params: z.object({
        id: objectId
    }),
    body: z.object({
        name: z.string().trim().min(2).max(100).optional(),
        price: z.number().positive().max(100000).optional(),
        durationMinutes: z.number().int().positive().max(1440).optional(),
        isActive: z.boolean().optional()
    })
});