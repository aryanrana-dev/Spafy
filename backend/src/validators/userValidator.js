import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{8,14}$/;

// Register User Validator
export const registerUserSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: "Name is required" })
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name cannot exceed 50 characters"),

        email: z
            .string({ required_error: "Email is required" })
            .trim()
            .email("Invalid email address")
            .toLowerCase(),

        password: z
            .string({ required_error: "Password is required" })
            .min(6, "Password must be at least 6 characters")
            .max(100, "Password cannot exceed 100 characters"),

        phone: z
            .string()
            .trim()
            .regex(phoneRegex, "Invalid phone number format")
            .optional(),

        role: z
            .enum(["user", "owner", "admin"])
            .optional()
    })
});

// Login User Validator (supports email or phone login)
export const loginUserSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase()
            .optional(),

        phone: z
            .string()
            .trim()
            .optional(),

        password: z
            .string({ required_error: "Password is required" })
            .min(1, "Password is required")
    }).refine((data) => data.email || data.phone, {
        message: "Either email or phone is required to login",
        path: ["email"]
    })
});

// Update Profile Validator
export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(50).optional(),
        phone: z.string().trim().regex(phoneRegex, "Invalid phone number").optional(),
        profilePic: z.string().optional()
    })
});