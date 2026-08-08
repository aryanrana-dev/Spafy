import express from "express";
 const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";


router.post("/", protectRoute, createService);

router.put("/:id", protectRoute, updateService);

router.delete("/:id", protectRoute, deleteService);

export default router;