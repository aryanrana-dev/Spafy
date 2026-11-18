import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.js";
import Salon from "./models/Salon.js";

async function seedRoles() {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/spafy";
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB:", mongoUri);

        const passwordHash = await bcrypt.hash("password123", 10);

        // 1. Seed / Upsert User
        let user = await User.findOne({ email: "user@spafy.com" });
        if (!user) {
            user = await User.create({
                name: "Demo Customer",
                fullName: "Demo Customer",
                email: "user@spafy.com",
                password: passwordHash,
                role: "user",
                phone: "+919876543201"
            });
            console.log("Created user: user@spafy.com (Role: user)");
        } else {
            user.role = "user";
            user.password = passwordHash;
            await user.save();
            console.log("Updated user: user@spafy.com (Role: user)");
        }

        // 2. Seed / Upsert Salon Owner
        let salonUser = await User.findOne({ email: "salon@spafy.com" });
        if (!salonUser) {
            salonUser = await User.create({
                name: "Eleanor Spa Partner",
                fullName: "Eleanor Vance",
                email: "salon@spafy.com",
                password: passwordHash,
                role: "salon",
                phone: "+919876543202"
            });
            console.log("Created salon user: salon@spafy.com (Role: salon)");
        } else {
            salonUser.role = "salon";
            salonUser.password = passwordHash;
            await salonUser.save();
            console.log("Updated salon user: salon@spafy.com (Role: salon)");
        }

        // 3. Seed / Upsert Admin
        let adminUser = await User.findOne({ email: "admin@spafy.com" });
        if (!adminUser) {
            adminUser = await User.create({
                name: "Spafy Super Admin",
                fullName: "System Administrator",
                email: "admin@spafy.com",
                password: passwordHash,
                role: "admin",
                phone: "+919876543203"
            });
            console.log("Created admin user: admin@spafy.com (Role: admin)");
        } else {
            adminUser.role = "admin";
            adminUser.password = passwordHash;
            await adminUser.save();
            console.log("Updated admin user: admin@spafy.com (Role: admin)");
        }

        // 4. Ensure demo salon "spafy" exists and is linked to salonUser
        let salon = await Salon.findOne({ slug: "spafy" });
        if (!salon) {
            salon = await Salon.create({
                name: "Modern Sanctuary Spafy",
                slug: "spafy",
                ownerId: salonUser._id,
                ownerPhone: salonUser.phone || "+919876543202",
                isActive: true,
                address: {
                    street: "123 Serenity Way, Suite 4",
                    city: "San Francisco",
                    pincode: "94102"
                },
                businessHours: [
                    { dayOfWeek: 1, isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
                    { dayOfWeek: 2, isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
                    { dayOfWeek: 3, isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
                    { dayOfWeek: 4, isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
                    { dayOfWeek: 5, isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
                    { dayOfWeek: 6, isOpen: true, openTime: "10:00 AM", closeTime: "06:00 PM" },
                    { dayOfWeek: 0, isOpen: false, openTime: "10:00 AM", closeTime: "04:00 PM" }
                ]
            });
            console.log("Created salon: Modern Sanctuary Spafy (slug: spafy)");
        } else {
            salon.ownerId = salonUser._id;
            await salon.save();
            console.log("Updated salon owner link for slug: spafy");
        }

        console.log("\n=======================================================");
        console.log("RBAC Demo Credentials:");
        console.log("1. User:  user@spafy.com  / password123 (Role: user)");
        console.log("2. Salon: salon@spafy.com / password123 (Role: salon) -> /spafy/dashboard");
        console.log("3. Admin: admin@spafy.com / password123 (Role: admin) -> Full Access");
        console.log("=======================================================\n");

    } catch (err) {
        console.error("Seed error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

seedRoles();

