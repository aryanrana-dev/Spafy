import express from "express"
const app = express()
import paymentRoutes from "./src/routes/paymentRoutes.js"
import cors from "cors"
import authRoutes from "./src/routes/auth.route.js"
import { connectDB } from "./src/lib/db.js"
import bookingRoutes from "./src/routes/bookingRoutes.js"


app.use(cors({origin:"http://localhost:5173",credentials:true

}))
app.use("/api/bookings",bookingRoutes);
app.use("/api/auth",authRoutes);

app.use(express.json())//req.body

app.use("/api/payment",paymentRoutes);


app.listen(8080,()=>{
    console.log("server is at 8080")
    connectDB();
})