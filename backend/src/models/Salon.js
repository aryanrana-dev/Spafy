
import mongoose from "mongoose";

const salonSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            lowercase: true
        },

        // User who owns this salon
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        address: {
            street: {
                type: String,
                trim: true
            },

            city: {
                type: String,
                trim: true
            },

            pincode: {
                type: String,
                trim: true
            }
        },

        businessHours: [
            {
                dayOfWeek: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 6
                },

                isOpen: {
                    type: Boolean,
                    default: false
                },

                openTime: {
                    type: String,
                    trim: true
                },

                closeTime: {
                    type: String,
                    trim: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Salon = mongoose.model("Salon", salonSchema);

export default Salon;
