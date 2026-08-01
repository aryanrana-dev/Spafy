import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    salonServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SalonService', required: true },

    appointmentDate: { type: Date, required: true }, // e.g., 2026-07-28
    startTime: { type: Date, required: true },       // ISO Date object for exact start
    endTime: { type: Date, required: true },         // Calculated using service duration

    status: {
        type: String,
        enum: ['payment_pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
        default: 'payment_pending'
    },

    // Temporarily locks the slot so no one else can click it while this user pays
    lockExpiration: { type: Date },

    createdAt: { type: Date, default: Date.now }
});
// Critical Index: Prevents double-booking queries from slowing down
bookingSchema.index({ staffId: 1, startTime: 1, endTime: 1 });

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking;