import { z } from "zod";

// MongoDB ObjectId validation
const objectId = z
    .string()
    .trim()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid MongoDB ID"
    );


// Create Payment / Payment Order
export const createPaymentSchema = z.object({

    body: z.object({

        bookingId: objectId,

        // Payment type can be selected by the client
        type: z
            .enum(["deposit", "full_payment"])
            .optional()

    }).strict(),

    params: z.object({}).strict(),

    query: z.object({}).strict()

});


// Verify Payment
export const verifyPaymentSchema = z.object({

    body: z.object({

        razorpayOrderId: z
            .string()
            .trim()
            .min(1, "Razorpay order ID is required"),

        razorpayPaymentId: z
            .string()
            .trim()
            .min(1, "Razorpay payment ID is required"),

        razorpaySignature: z
            .string()
            .trim()
            .min(1, "Razorpay signature is required")

    }).strict(),

    params: z.object({}).strict(),

    query: z.object({}).strict()

});