import express from "express"
const router = express.Router()
import { paymentController } from "../controllers/paymentController.js"


router.post("/create-order",paymentController)

export default router;