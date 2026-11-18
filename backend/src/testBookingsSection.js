import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();
process.env.NODE_ENV = "test";

import http from "http";
import axios from "axios";
import { app } from "../server.js";
import { connectDB } from "./lib/db.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import SalonService from "./models/SalonService.js";
import Salon from "./models/Salon.js";

const PORT = 8092;

async function runTests() {
    await connectDB();
    const server = http.createServer(app);

    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`Test server running on port ${PORT}`);

    const client = axios.create({
        baseURL: `http://localhost:${PORT}/api`,
        validateStatus: () => true
    });

    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`  ✓ PASS: ${message}`);
            passed++;
        } else {
            console.error(`  ✗ FAIL: ${message}`);
            failed++;
        }
    }

    try {
        console.log("\n--- TEST 1: Login user and fetch bookings strictly for logged user ---");
        const loginRes = await client.post("/auth/login", {
            email: "user@spafy.com",
            password: "password123"
        });
        assert(loginRes.status === 200, "user@spafy.com logged in successfully");
        const token = loginRes.data.token;
        const loggedUserId = loginRes.data._id;

        // Fetch bookings for this user
        const myBookingsRes = await client.get("/user/booking/my-bookings", {
            headers: { Authorization: `Bearer ${token}` }
        });
        assert(myBookingsRes.status === 200, "GET /user/booking/my-bookings returns 200");
        assert(Array.isArray(myBookingsRes.data.bookings), "Response contains bookings array");

        const bookings = myBookingsRes.data.bookings;
        console.log(`  Total bookings returned for logged user: ${bookings.length}`);

        // Verify that EVERY booking belongs strictly to the logged user
        const allBelongToUser = bookings.every(b => {
            const bUserId = b.userId?._id ? String(b.userId._id) : String(b.userId);
            return bUserId === String(loggedUserId);
        });
        assert(allBelongToUser, "ALL returned bookings belong strictly to the logged-in user");

        console.log("\n--- TEST 2: Formatting bookings for UI without crash ---");
        // Verify formatBookingForUI simulation
        for (const raw of bookings) {
            assert(raw.salonId !== undefined, `Booking ${raw._id} has salonId populated`);
            assert(typeof raw.salonId?.name === "string", `Booking ${raw._id} salon name is string: ${raw.salonId?.name}`);
            
            // Format address
            let addressText = `Suite 04 • ${raw.salonId?.name || "Spafy Sanctuary"}`;
            if (typeof raw.salonId?.address === "string" && raw.salonId.address.trim()) {
                addressText = raw.salonId.address.trim();
            } else if (raw.salonId?.address && typeof raw.salonId.address === "object") {
                const addr = raw.salonId.address;
                const parts = [addr.street, addr.city, addr.pincode].filter(Boolean);
                if (parts.length > 0) addressText = parts.join(", ");
            }
            assert(typeof addressText === "string" && addressText.length > 0, `Address formatted cleanly as string: "${addressText}"`);
        }

        console.log("\n--- TEST 3: Fresh user with 0 bookings gets empty array (no mock leakage) ---");
        // Create or login fresh user
        const freshEmail = `fresh_${Date.now()}@example.com`;
        const signupRes = await client.post("/auth/signup", {
            fullName: "Fresh User",
            email: freshEmail,
            password: "password123",
            role: "user"
        });
        assert(signupRes.status === 201, "Fresh user registered successfully");
        const freshToken = signupRes.data.token;

        const freshBookingsRes = await client.get("/user/booking/my-bookings", {
            headers: { Authorization: `Bearer ${freshToken}` }
        });
        assert(freshBookingsRes.status === 200, "Fresh user GET /my-bookings returns 200");
        assert(freshBookingsRes.data.count === 0, "Fresh user has count 0");
        assert(freshBookingsRes.data.bookings.length === 0, "Fresh user bookings array is empty (no leaked bookings)");

        console.log("\n--- TEST 4: User creates a new booking, then sees only their own booking ---");
        // Find an active salon and service
        const service = await SalonService.findOne({ isActive: true });
        assert(Boolean(service), "Found active salon service for booking test");

        if (service) {
            const fiveDaysLater = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
            fiveDaysLater.setHours(11, 0, 0, 0);

            const createRes = await client.post("/user/booking/book", {
                salonId: String(service.salonId),
                salonServiceId: String(service._id),
                appointmentDate: fiveDaysLater.toISOString(),
                startTime: fiveDaysLater.toISOString()
            }, {
                headers: { Authorization: `Bearer ${freshToken}` }
            });

            assert(createRes.status === 201, "New booking created successfully for fresh user");
            const newBookingId = createRes.data.booking?._id;

            // Fetch fresh user's bookings again
            const updatedFreshRes = await client.get("/user/booking/my-bookings", {
                headers: { Authorization: `Bearer ${freshToken}` }
            });
            assert(updatedFreshRes.data.count === 1, "Fresh user now has exactly 1 booking");
            assert(String(updatedFreshRes.data.bookings[0]._id) === String(newBookingId), "The 1 booking matches newly created booking ID");

            // Verify original user still only has their own bookings (no bleed-through)
            const user1Res = await client.get("/user/booking/my-bookings", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user1Ids = user1Res.data.bookings.map(b => String(b._id));
            assert(!user1Ids.includes(String(newBookingId)), "Original user does NOT see fresh user's booking");
        }

        console.log("\n=======================================================");
        console.log(`TOTAL BOOKINGS TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
        console.log("=======================================================\n");

    } finally {
        server.close();
        await mongoose.disconnect();
    }
}

runTests();
