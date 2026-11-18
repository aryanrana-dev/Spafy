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

const PORT = 8089;

async function runTests() {
    await connectDB();
    const server = http.createServer(app);

    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`Test server running on port ${PORT}`);

    const client = axios.create({
        baseURL: `http://localhost:${PORT}/api`,
        validateStatus: () => true // Don't throw on 4xx/5xx
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
        console.log("\n--- TEST SUITE 1: Authentication & Role Assignment ---");

        // 1. Login as User
        const userRes = await client.post("/auth/login", {
            email: "user@spafy.com",
            password: "password123"
        });
        assert(userRes.status === 200, "User login status is 200");
        assert(userRes.data.role === "user", `User role returned is 'user' (got: ${userRes.data?.role})`);
        const userToken = userRes.data?.token;

        // 2. Login as Salon
        const salonRes = await client.post("/auth/login", {
            email: "salon@spafy.com",
            password: "password123"
        });
        assert(salonRes.status === 200, "Salon login status is 200");
        assert(salonRes.data.role === "salon", `Salon role returned is 'salon' (got: ${salonRes.data?.role})`);
        assert(salonRes.data.salonSlug === "spafy", `Salon slug returned is 'spafy' (got: ${salonRes.data?.salonSlug})`);
        const salonToken = salonRes.data?.token;

        // 3. Login as Admin
        const adminRes = await client.post("/auth/login", {
            email: "admin@spafy.com",
            password: "password123"
        });
        assert(adminRes.status === 200, "Admin login status is 200");
        assert(adminRes.data.role === "admin", `Admin role returned is 'admin' (got: ${adminRes.data?.role})`);
        const adminToken = adminRes.data?.token;

        // 4. Test unauthorized privilege escalation on signup
        const badAdminSignup = await client.post("/auth/signup", {
            fullName: "Attacker",
            email: `attacker_${Date.now()}@test.com`,
            password: "password123",
            role: "admin"
        });
        assert(badAdminSignup.status === 403, "Public signup as admin without secret rejected with 403");

        console.log("\n--- TEST SUITE 2: Protected Routes - Unauthenticated ---");
        const unauthOwner = await client.get("/owner/booking/all");
        assert(unauthOwner.status === 401, "Unauthenticated /owner/booking/all returns 401");

        const unauthUserBooking = await client.get("/user/booking/my-bookings");
        assert(unauthUserBooking.status === 401, "Unauthenticated /user/booking/my-bookings returns 401");

        const unauthPayment = await client.post("/payment/create-order", { amount: 100 });
        assert(unauthPayment.status === 401, "Unauthenticated /payment/create-order returns 401");

        console.log("\n--- TEST SUITE 3: RBAC - User Role Access Bounds ---");
        // User accessing user bookings -> allowed
        const userOwnBookings = await client.get("/user/booking/my-bookings", {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        assert(userOwnBookings.status === 200, "User can access their own bookings (200)");

        // User accessing owner/salon endpoints -> FORBIDDEN (403)
        const userOwnerAccess = await client.get("/owner/booking/all", {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        assert(userOwnerAccess.status === 403, "User accessing /owner/booking/all is forbidden (403)");

        console.log("\n--- TEST SUITE 4: RBAC - Salon Role Access Bounds ---");
        // Salon accessing owner bookings -> allowed (200)
        const salonOwnerAccess = await client.get("/owner/booking/all", {
            headers: { Authorization: `Bearer ${salonToken}` }
        });
        assert(salonOwnerAccess.status === 200, "Salon can access owner bookings (200)");

        // Salon accessing user booking APIs -> FORBIDDEN (403)
        const salonUserAccess = await client.get("/user/booking/my-bookings", {
            headers: { Authorization: `Bearer ${salonToken}` }
        });
        assert(salonUserAccess.status === 403, "Salon accessing /user/booking/my-bookings is forbidden (403)");

        console.log("\n--- TEST SUITE 5: RBAC - Admin Superuser Access ---");
        // Admin accessing owner bookings -> allowed (200)
        const adminOwnerAccess = await client.get("/owner/booking/all", {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert(adminOwnerAccess.status === 200, "Admin can access owner bookings (200)");

        // Admin accessing user bookings -> allowed (200)
        const adminUserAccess = await client.get("/user/booking/my-bookings", {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert(adminUserAccess.status === 200, "Admin can access user bookings (200)");

        // Admin accessing me endpoint -> allowed (200)
        const adminMe = await client.get("/auth/me", {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert(adminMe.status === 200 && adminMe.data.user.role === "admin", "Admin /auth/me returns admin role");

        console.log("\n=======================================================");
        console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
        console.log("=======================================================\n");

    } finally {
        server.close();
        await mongoose.disconnect();
    }
}

runTests();
