import mongoose from "mongoose";

const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    ownerPhone: { type: String, required: true },
    address: {
        street: String,
        city: String,
        pincode: String
    },
    businessHours: [{
        dayOfWeek: { type: Number, min: 0, max: 6 },
        isOpen: Boolean,
        openTime: String,
        closeTime: String,
    }],
    createdAt: { type: Date, default: Date.now }
});

const Salon = mongoose.model("Salon", salonSchema)

export default Salon;