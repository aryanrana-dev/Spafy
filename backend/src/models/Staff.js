import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String },

    servicesProvided: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SalonService' }],

    // Custom schedule if they don't work the full salon hours
    workingDays: [{
        dayOfWeek: Number,
        startTime: String,
        endTime: String
    }],
    isActive: { type: Boolean, default: true }
});

const Staff = mongoose.model("Staff", staffSchema)

export default Staff;