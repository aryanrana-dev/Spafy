import { z } from "zod";

// =====================================================
// CREATE SALON VALIDATION
// =====================================================

export const createSalonSchema = z.object({

    body: z.object({

        // Salon name
        name: z
            .string()
            .trim()
            .min(2, "Salon name must be at least 2 characters")
            .max(100, "Salon name cannot exceed 100 characters"),

        // Salon slug
        slug: z
            .string()
            .trim()
            .min(2, "Slug must be at least 2 characters")
            .max(100, "Slug cannot exceed 100 characters")
            .regex(
                /^[a-z0-9-]+$/,
                "Slug can only contain lowercase letters, numbers and hyphens"
            ),

        // Address
        address: z.object({

            street: z
                .string()
                .trim()
                .optional(),

            city: z
                .string()
                .trim()
                .optional(),

            pincode: z
                .string()
                .trim()
                .regex(
                    /^\d{6}$/,
                    "Pincode must be exactly 6 digits"
                )
                .optional()

        }).optional(),

        // Business hours
        businessHours: z
            .array(
                z.object({

                    dayOfWeek: z
                        .number()
                        .int()
                        .min(0)
                        .max(6),

                    isOpen: z
                        .boolean()
                        .optional(),

                    openTime: z
                        .string()
                        .trim()
                        .optional(),

                    closeTime: z
                        .string()
                        .trim()
                        .optional()

                })
            )
            .optional()

    })

});