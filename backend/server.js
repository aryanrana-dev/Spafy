import express from "express"
const app = express()
import paymentRoutes from "./src/routes/paymentRoutes.js"
import cors from "cors"
import authRoutes from "./src/routes/auth.route.js"
import { connectDB } from "./src/lib/db.js"
import salonRoutes from "./src/routes/salon.js"

app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }))

app.use("/api/auth", authRoutes);

app.use("/api/salon", salonRoutes);

app.use("/api/payment", paymentRoutes);

app.listen(8080, () => {
    console.log("server is at 8080")
    connectDB();
})