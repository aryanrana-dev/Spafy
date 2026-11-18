import Razorpay from "razorpay"
import dotenv from "dotenv"
import Payment from "../models/Payment.js"
import Booking from "../models/Booking.js"
dotenv.config()

const getRazorpay = () => {
    return new Razorpay({
        key_id: process.env.Test_Api_Key?.trim() || "rzp_test_TLmoaRhJoXYN1G",
        key_secret: process.env.Test_Api_Secret_Key?.trim() || "XLmGEwaRtTZ9vLc04D1ntuOq"
    });
};

export const paymentController = async (req, res) => {
    try {
        const razorpay = getRazorpay();
        const amount = Number(req.body?.amount) || 500;
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({
            message: "Failed to create order",
            err: err.message
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, bookingId, userId, salonId, amount } = req.body || {};
        
        // Prevent IDOR: use authenticated user's ID unless admin explicitly passes a different userId
        const effectiveUserId = (req.user?.role === "admin" && userId) ? userId : req.user?._id;

        const payment = await Payment.create({
            bookingId: bookingId || undefined,
            userId: effectiveUserId,
            salonId: salonId || undefined,
            razorpayOrderId: razorpay_order_id || "order_manual",
            razorpayPaymentId: razorpay_payment_id || undefined,
            amount: Number(amount) || 0,
            status: "success"
        });

        if (bookingId) {
            await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });
        }

        res.status(200).json({ success: true, payment });
    } catch (err) {
        res.status(500).json({ success: false, message: "Payment verification failed", err: err.message });
    }
}