import express from "express";
import { getDashboardMetrics } from "../controllers/dashboardController.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { ownerOnly } from "../middleware/owner.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.use(ownerOnly);

router.get("/metrics", getDashboardMetrics);

export default router;
