import express, { Router } from "express";
import { signup,login,logout } from "../controllers/auth.controller.js";
 const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";
 import { updateProfile } from "../controllers/auth.controller.js";
 import passport from "passport";
import {
  googleCallback
} from "../controllers/authController.js";


router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);


export default router;
