
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        phone: {
            type: String,
            trim: true,
            sparse: true,
            index: true
        },

        password: {
            type: String,
            required: function () {
                return !this.googleId;
            }
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
            enum: ["user", "owner", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

userSchema.virtual("fullName").get(function () {
    return this.name;
}).set(function (name) {
    this.name = name;
});

const User = mongoose.model("User", userSchema);

export default User;

