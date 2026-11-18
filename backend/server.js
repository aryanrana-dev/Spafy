import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();
import cookieParser from "cookie-parser";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import cors from "cors";
import authRoutes from "./src/routes/auth.route.js";
import { connectDB } from "./src/lib/db.js";
import userBookingRoute from "./src/routes/userBookingRoute.js";
import ownerBookingRoute from "./src/routes/ownerBookingRoute.js";
import salonRoutes from "./src/routes/salonRoute.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user/booking", userBookingRoute);
app.use("/api/owner/booking", ownerBookingRoute);
app.use("/api/salons", salonRoutes);
app.use("/api/payment", paymentRoutes);

if (process.env.NODE_ENV !== "test") {
    app.listen(8080, () => {
        console.log("server is at 8080");
        connectDB();
    });
}

export default app;
export { app };
