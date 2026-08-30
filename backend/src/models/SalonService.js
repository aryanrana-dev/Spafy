import mongoose from "mongoose";

const salonServiceSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    masterServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterService' }, //required: true 
    name: { type: String, required: true },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
});

const SalonService = mongoose.model("SalonService", salonServiceSchema)

export default SalonService;