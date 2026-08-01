import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true }, // 1 review per booking

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema)

export default Review;