import express from "express";
import { signup, login, logout, getMe, updateProfile, googleUrl, googleCallback } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/google", googleUrl);
router.get("/google/callback", googleCallback);

export default router;