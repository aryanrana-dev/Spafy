import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI?.trim() || "mongodb://127.0.0.1:27017/spafy";
        const conn = await mongoose.connect(uri);
        console.log("mongodb connected");
        return conn;
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};
