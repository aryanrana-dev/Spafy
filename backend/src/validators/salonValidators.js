import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Create Salon Validator
export const createSalonSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: "Salon name is required" })
            .trim()
            .min(2, "Salon name must be at least 2 characters")
            .max(100, "Salon name cannot exceed 100 characters"),

        slug: z
            .string({ required_error: "Slug is required" })
            .trim()
            .min(2, "Slug must be at least 2 characters")
            .max(100, "Slug cannot exceed 100 characters")
            .regex(
                /^[a-z0-9-]+$/,
                "Slug can only contain lowercase letters, numbers, and hyphens"
            ),

        ownerPhone: z
            .string({ required_error: "Owner phone is required" })
            .trim()
            .min(7, "Owner phone is too short"),

        address: z.object({
            street: z.string().trim().optional(),
            city: z.string().trim().optional(),
            pincode: z.string().trim().optional()
        }).optional(),

        businessHours: z
            .array(
                z.object({
                    dayOfWeek: z.number().int().min(0).max(6),
                    isOpen: z.boolean().optional(),
                    openTime: z.string().trim().optional(),
                    closeTime: z.string().trim().optional()
                })
            )
            .optional(),

        images: z.array(z.string()).optional()
    })
});

// Update Salon Validator
export const updateSalonSchema = z.object({
    params: z.object({
        id: z.string().regex(objectIdRegex, "Invalid salon ID")
    }),
    body: z.object({
        name: z.string().trim().min(2).max(100).optional(),
        ownerPhone: z.string().trim().min(7).optional(),
        address: z.object({
            street: z.string().trim().optional(),
            city: z.string().trim().optional(),
            pincode: z.string().trim().optional()
        }).optional(),
        businessHours: z.array(z.any()).optional(),
        images: z.array(z.string()).optional(),
        isActive: z.boolean().optional()
    })
});