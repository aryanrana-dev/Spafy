
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        lowercase: true,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    password: {
        type: String,
        required: true
    },

    googleId: {
        type: String,
        default: null,
        sparse: true
    },

    role: {
        type: String,
        enum: ["user", "owner","admin"],
        default: "user"
    }
});

const User = mongoose.model("User", userSchema);

export default User;

