import express from "express";
const router = express.Router();
import { fetchSalonService } from "../controllers/salon.js";

router.get("/fetch-services", fetchSalonService);

export default router;