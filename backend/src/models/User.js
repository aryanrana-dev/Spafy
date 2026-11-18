
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        trim: true
    },

    name: {
        type: String,
        trim: true
    },

    fullName: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    profilePic: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

        profilePic: {
            type: String,
            default: ""
        },

        googleId: {
            type: String,
            default: null,
            sparse: true
        },

    role: {
        type: String,
        enum: ["user", "salon", "owner", "admin"],
        default: "user"
    }
);

userSchema.virtual("fullName").get(function () {
    return this.name;
}).set(function (name) {
    this.name = name;
});

const User = mongoose.model("User", userSchema);

export default User;

