import express from "express"
const app = express()
import paymentRoutes from "./src/routes/paymentRoutes.js"
import cors from "cors"
import authRoutes from "./src/routes/auth.route.js"
import { connectDB } from "./src/lib/db.js"
import {ownerRoutes} from "./src/routes/ownerRoute.js"
import passport from "./src/config/passport.js"
import googleRoutes from "./routes/googleRoutes.js";
import userBookingRoute from "./src/routes/userBookingRoute.js"
import ownerBookingRoute from "./src/routes/ownerBookingRoute.js"
import salonRoutes from "./src/routes/salonRoute.js"

app.use(cors({origin:"http://localhost:5173",credentials:true

}))

app.use("/api/auth", googleRoutes);
app.use(passport.initialize());
app.use("/api/user/booking",userBookingRoute);
app.use("/api/auth",authRoutes);
app.use("api/owner/booking",ownerBookingRoute)
app.use("/api/salons", salonRoutes);


app.use(express.json())//req.body

app.use("/api/payment",paymentRoutes);


app.listen(8080,()=>{
    console.log("server is at 8080")
    connectDB();
})