import express from "express";
const router = express.Router();
import {
    signup,
    login,
    logout,
    getMe,
    updateProfile,
    googleUrl,
    googleCallback
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Profile & Session routes
router.get("/me", protectRoute, getMe);
router.put("/update-profile", protectRoute, updateProfile);

// OAuth
router.get("/google", googleUrl);
router.get("/google/callback", googleCallback);

export default router;
