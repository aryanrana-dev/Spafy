
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        salonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Salon",
            required: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        salonServiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SalonService",
            required: false
        },

        services: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SalonService"
            }
        ],

        totalAmount: {
            type: Number,
            default: 0
        },

        // Date on which the appointment takes place
        appointmentDate: {
            type: Date,
            required: true
        },

        // Exact appointment start time
        startTime: {
            type: Date,
            required: true
        },

        // Calculated from service duration
        endTime: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "payment_pending",
                "confirmed",
                "completed",
                "cancelled",
                "no_show"
            ],
            default: "payment_pending",
            index: true
        },

        // Temporary lock while payment is being completed
        lockExpiration: {
            type: Date,
            default: null,
            index: true
        }
    },
    {
        timestamps: true
    }
);


// =====================================================
// INDEXES
// =====================================================

// Helps user's booking history
bookingSchema.index({
    userId: 1,
    appointmentDate: -1
});

// Helps salon/admin booking queries
bookingSchema.index({
    salonId: 1,
    appointmentDate: 1
});


const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
