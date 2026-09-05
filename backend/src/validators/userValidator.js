import { z } from "zod";


// Phone number validation
const phone = z
    .string()
    .trim()
    .regex(
        /^\+?[1-9]\d{9,14}$/,
        "Invalid phone number"
    );


// Create/Register User
export const registerUserSchema = z.object({

    body: z.object({

        phone: phone,

        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name cannot exceed 50 characters"),

        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase()
            .optional(),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password cannot exceed 100 characters")

    }).strict(),

    params: z.object({}).strict(),

    query: z.object({}).strict()

});


// Login User
export const loginUserSchema = z.object({

    body: z.object({

        phone: phone,

        password: z
            .string()
            .min(1, "Password is required")

    }).strict(),

    params: z.object({}).strict(),

    query: z.object({}).strict()

});