import express from "express"
const app = express()
import paymentRoutes from "./src/routes/paymentRoutes.js"
import cors from "cors"


app.use(cors({origin:"http://localhost:5173",

}))


app.use(express.json())//req.body

app.use("/api/payment",paymentRoutes);


app.listen(8080,()=>{
    console.log("server is at 8080")
})