import express from "express";
const router = express.Router();
import { paymentController, verifyPayment } from "../controllers/paymentController.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";

// Payments can only be initiated and verified by authenticated Users (and Admins)
router.use(protectRoute);
router.use(authorizeRoles("user", "admin"));

router.post("/create-order", paymentController);
router.post("/verify", verifyPayment);

export default router;
