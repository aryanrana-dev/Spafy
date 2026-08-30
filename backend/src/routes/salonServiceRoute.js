import express from "express";
import {
    createService,
    updateService,
    deleteService
} from "../controllers/salonServiceController.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { ownerOnly } from "../middleware/owner.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.use(ownerOnly);

router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;