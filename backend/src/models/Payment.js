import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },

    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String }, // Populated after successful payment

    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'full_payment'], default: 'deposit' },
    status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },

    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", paymentSchema)

export default Payment;