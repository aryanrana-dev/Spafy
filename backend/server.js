import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.route.js";
import salonRoutes from "./src/routes/salonRoute.js";
import serviceRoutes from "./src/routes/serviceRoute.js";
import userBookingRoute from "./src/routes/userBookingRoute.js";
import ownerBookingRoute from "./src/routes/ownerBookingRoute.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import reviewRoutes from "./src/routes/reviewRoute.js";
import dashboardRoutes from "./src/routes/dashboardRoute.js";

const app = express();

// Allowed CORS origins (configurable via FRONTEND_URL environment variable)
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean);

// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/user/booking", userBookingRoute);
app.use("/api/owner/booking", ownerBookingRoute);
app.use("/api/owner/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Spafy Backend API is healthy" });
});

// 404 Handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});