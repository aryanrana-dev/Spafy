import User from "../models/User.js";
import Salon from "../models/Salon.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import { getGoogleAuthURL, getGoogleUserInfo } from "../services/googleAuthService.js";
import { normalizeRole } from "../middleware/rbac.middleware.js";
import dotenv from "dotenv";
dotenv.config();

// Helper to find associated salon slug for salon/admin accounts
const getSalonSlugForUser = async (userId, role) => {
    if (role === "salon" || role === "admin" || role === "owner") {
        try {
            const salon = await Salon.findOne({ ownerId: userId }).select("slug");
            return salon?.slug || "spafy";
        } catch (e) {
            return "spafy";
        }
    }
    return null;
};

export const signup = async (req, res) => {
    try {
        const { fullName, name, email, password, role, adminSecret } = req.body || {};
        const userName = (fullName || name || "").trim();
        const cleanEmail = (email || "").toLowerCase().trim();

        if (!userName || !cleanEmail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Determine Role with Security Guard
        let assignedRole = "user";
        const requestedRole = normalizeRole(role);

        if (requestedRole === "salon") {
            assignedRole = "salon";
        } else if (requestedRole === "admin") {
            // Protect Admin role creation against privilege escalation
            const configuredSecret = process.env.ADMIN_SECRET || "spafy-admin-secret";
            if (adminSecret && adminSecret === configuredSecret) {
                assignedRole = "admin";
            } else {
                return res.status(403).json({
                    message: "Unauthorized: Valid adminSecret required to register as Admin"
                });
            }
        } else {
            assignedRole = "user";
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: userName,
            fullName: userName,
            email: cleanEmail,
            password: hashedPassword,
            role: assignedRole
        });

        const savedUser = await newUser.save();
        const effectiveRole = normalizeRole(savedUser.role);
        const token = generateToken(savedUser._id, effectiveRole, res);
        const salonSlug = await getSalonSlugForUser(savedUser._id, effectiveRole);

        return res.status(201).json({
            _id: savedUser._id,
            fullName: savedUser.fullName,
            email: savedUser.email,
            profilePic: savedUser.profilePic,
            role: effectiveRole,
            salonSlug,
            token
        });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const cleanEmail = (email || "").toLowerCase().trim();

        if (!cleanEmail || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const effectiveRole = normalizeRole(user.role);
        const token = generateToken(user._id, effectiveRole, res);
        const salonSlug = await getSalonSlugForUser(user._id, effectiveRole);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName || user.name,
            email: user.email,
            profilePic: user.profilePic,
            role: effectiveRole,
            salonSlug,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const logout = async (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
        message: "Logged out successfully"
    });
};

export const getMe = async (req, res) => {
    try {
        const user = req.user;
        const effectiveRole = normalizeRole(user.role);
        const salonSlug = await getSalonSlugForUser(user._id, effectiveRole);

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName || user.name,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: effectiveRole,
                profilePic: user.profilePic,
                salonSlug
            }
        });
    } catch (err) {
        console.error("Get me error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullName, name, phone } = req.body || {};
        const updateData = {};

        if (profilePic) {
            updateData.profilePic = profilePic;
        }
        if (fullName || name) {
            const cleanName = (fullName || name).trim();
            updateData.fullName = cleanName;
            updateData.name = cleanName;
        }
        if (phone) {
            updateData.phone = String(phone).trim();
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        ).select("-password");

        const effectiveRole = normalizeRole(updatedUser.role);
        const salonSlug = await getSalonSlugForUser(updatedUser._id, effectiveRole);

        return res.status(200).json({
            success: true,
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName || updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: effectiveRole,
                profilePic: updatedUser.profilePic,
                salonSlug
            }
        });
    } catch (error) {
        console.error("Error in update profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const googleUrl = async (req, res) => {
    const authUrl = getGoogleAuthURL();
    res.redirect(authUrl);
};

export const googleCallback = async (req, res) => {
    try {
        const { code, error } = req.query;
        if (error || !code) {
            console.error("Google auth error or no code:", error);
            return res.redirect(`http://localhost:5173/salon/login?error=${encodeURIComponent(error || "Google authorization cancelled")}`);
        }

        const googleUser = await getGoogleUserInfo(code);
        let user = await User.findOne({ email: googleUser.email });
        if (!user) {
            user = await User.create({
                name: googleUser.name,
                fullName: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.id,
                password: await bcrypt.hash(Math.random().toString(36), 10),
                role: "user"
            });
        }

        const effectiveRole = normalizeRole(user.role);
        const token = generateToken(user._id, effectiveRole, res);
        const userName = encodeURIComponent(user.fullName || user.name || "Client");
        const userEmail = encodeURIComponent(user.email);
        const salonSlug = await getSalonSlugForUser(user._id, effectiveRole) || "spafy";

        let redirectPath = "/salon/spafy";
        if (effectiveRole === "salon") {
            redirectPath = `/${salonSlug}/dashboard`;
        }

        return res.redirect(
            `http://localhost:5173${redirectPath}?auth=google&token=${token}&userId=${user._id}&fullName=${userName}&email=${userEmail}&role=${effectiveRole}&salonSlug=${salonSlug}`
        );
    } catch (error) {
        console.error("Google callback error:", error);
        return res.redirect(`http://localhost:5173/salon/login?error=${encodeURIComponent(error.message || "Google authentication failed")}`);
    }
};
