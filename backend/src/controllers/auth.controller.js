import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import { getGoogleAuthURL, getGoogleUserInfo } from "../services/googleAuthService.js";
import dotenv from "dotenv";
dotenv.config();

// =====================================================
// SIGNUP
// =====================================================
export const signup = async (req, res) => {
    const { name, fullName, email, password, phone, role } = req.body;
    const userName = name || fullName;

    try {
        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        if (phone) {
            const existingPhone = await User.findOne({ phone: phone.trim() });
            if (existingPhone) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number already registered"
                });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const assignedRole = role === "owner" ? "owner" : "user";

        const userPayload = {
            name: userName.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: assignedRole
        };

        if (phone && phone.trim()) {
            userPayload.phone = phone.trim();
        }

        const newUser = await User.create(userPayload);

        const token = generateToken(newUser._id, res);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                profilePic: newUser.profilePic
            }
        });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// LOGIN
// =====================================================
export const login = async (req, res) => {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
        return res.status(400).json({
            success: false,
            message: "Email/phone and password are required"
        });
    }

    try {
        const query = email ? { email: email.trim().toLowerCase() } : { phone: phone.trim() };
        const user = await User.findOne(query);

        if (!user || !user.password) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateToken(user._id, res);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profilePic: user.profilePic
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// LOGOUT
// =====================================================
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// GET CURRENT LOGGED IN USER (/me)
// =====================================================
export const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                role: req.user.role,
                profilePic: req.user.profilePic
            }
        });
    } catch (error) {
        console.error("GetMe error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// UPDATE PROFILE
// =====================================================
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, name, phone } = req.body;
        const updates = {};

        if (profilePic !== undefined) updates.profilePic = profilePic;
        if (name) updates.name = name.trim();
        if (phone) updates.phone = phone.trim();

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error in update profile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// GOOGLE OAUTH
// =====================================================
export const googleUrl = async (req, res) => {
    try {
        const authUrl = getGoogleAuthURL();
        return res.redirect(authUrl);
    } catch (error) {
        console.error("Google auth URL error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate Google auth URL"
        });
    }
};

export const googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.redirect("http://localhost:5173/salon/login?error=no_code");
        }

        const googleUser = await getGoogleUserInfo(code);
        if (!googleUser || !googleUser.email) {
            return res.redirect("http://localhost:5173/salon/login?error=failed_google_auth");
        }

        let user = await User.findOne({ email: googleUser.email.toLowerCase() });

        if (!user) {
            user = await User.create({
                name: googleUser.name || "Google User",
                email: googleUser.email.toLowerCase(),
                googleId: googleUser.id,
                role: "user"
            });
        } else if (!user.googleId) {
            user.googleId = googleUser.id;
            await user.save();
        }

        generateToken(user._id, res);

        const redirectPath = user.role === "owner" ? "/salon/dashboard" : "/";
        return res.redirect(`http://localhost:5173${redirectPath}`);

    } catch (error) {
        console.error("Google callback error:", error);
        return res.redirect("http://localhost:5173/salon/login?error=auth_error");
    }
};
