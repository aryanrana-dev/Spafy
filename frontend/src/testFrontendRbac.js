/**
 * Verification of Frontend RBAC Role Guard Logic
 */

function checkAccess({ user, isAuthenticated, allowedRoles, allowPublic }) {
    const rawRole = user?.role;
    const userRole = (rawRole === "owner" ? "salon" : rawRole) || "user";
    const isAuthed = isAuthenticated && Boolean(user);

    if (!isAuthed) {
        if (allowPublic) return { allowed: true, reason: "Public access granted" };
        return { allowed: false, redirect: "/salon/login", reason: "Unauthenticated" };
    }

    if (userRole === "admin") {
        return { allowed: true, reason: "Admin superuser access granted" };
    }

    const normalizedAllowed = allowedRoles.map(r => r === "owner" ? "salon" : r);

    if (normalizedAllowed.includes(userRole)) {
        return { allowed: true, reason: `Role '${userRole}' authorized` };
    }

    return { allowed: false, redirect: "/unauthorized", reason: `Role '${userRole}' forbidden` };
}

// Test cases
const tests = [
    // Case 1: Unauthenticated user visiting public salon page
    {
        name: "Unauthenticated guest on /salon/spafy (allowPublic=true)",
        input: { user: null, isAuthenticated: false, allowedRoles: ["user", "admin"], allowPublic: true },
        expectedAllowed: true
    },
    // Case 2: Unauthenticated user visiting checkout (allowPublic=false)
    {
        name: "Unauthenticated guest on /salon/checkout",
        input: { user: null, isAuthenticated: false, allowedRoles: ["user", "admin"], allowPublic: false },
        expectedAllowed: false,
        expectedRedirect: "/salon/login"
    },
    // Case 3: User role visiting checkout
    {
        name: "User role visiting checkout",
        input: { user: { role: "user" }, isAuthenticated: true, allowedRoles: ["user", "admin"], allowPublic: false },
        expectedAllowed: true
    },
    // Case 4: User role visiting salon dashboard (/:salonName/dashboard)
    {
        name: "User role visiting salon dashboard",
        input: { user: { role: "user" }, isAuthenticated: true, allowedRoles: ["salon", "admin"], allowPublic: false },
        expectedAllowed: false,
        expectedRedirect: "/unauthorized"
    },
    // Case 5: Salon role visiting salon dashboard (/:salonName/dashboard)
    {
        name: "Salon role visiting salon dashboard",
        input: { user: { role: "salon" }, isAuthenticated: true, allowedRoles: ["salon", "admin"], allowPublic: false },
        expectedAllowed: true
    },
    // Case 6: Salon role visiting client salon page
    {
        name: "Salon role visiting client salon page (/salon/spafy)",
        input: { user: { role: "salon" }, isAuthenticated: true, allowedRoles: ["user", "admin"], allowPublic: true },
        expectedAllowed: false,
        expectedRedirect: "/unauthorized"
    },
    // Case 7: Salon role visiting bookings (/salon/bookings)
    {
        name: "Salon role visiting customer bookings",
        input: { user: { role: "salon" }, isAuthenticated: true, allowedRoles: ["user", "admin"], allowPublic: false },
        expectedAllowed: false,
        expectedRedirect: "/unauthorized"
    },
    // Case 8: Admin role visiting customer bookings
    {
        name: "Admin role visiting customer bookings",
        input: { user: { role: "admin" }, isAuthenticated: true, allowedRoles: ["user", "admin"], allowPublic: false },
        expectedAllowed: true
    },
    // Case 9: Admin role visiting salon dashboard
    {
        name: "Admin role visiting salon dashboard",
        input: { user: { role: "admin" }, isAuthenticated: true, allowedRoles: ["salon", "admin"], allowPublic: false },
        expectedAllowed: true
    },
    // Case 10: Admin role visiting checkout
    {
        name: "Admin role visiting checkout",
        input: { user: { role: "admin" }, isAuthenticated: true, allowedRoles: ["user", "admin"], allowPublic: false },
        expectedAllowed: true
    }
];

let passed = 0;
let failed = 0;

console.log("Running Frontend RBAC Guard Unit Tests:\n");
for (const t of tests) {
    const res = checkAccess(t.input);
    const pass = res.allowed === t.expectedAllowed && (!t.expectedRedirect || res.redirect === t.expectedRedirect);
    if (pass) {
        console.log(`✓ PASS: ${t.name} -> ${res.reason}`);
        passed++;
    } else {
        console.error(`✗ FAIL: ${t.name} (got allowed: ${res.allowed}, expected: ${t.expectedAllowed})`);
        failed++;
    }
}

console.log(`\n=======================================================`);
console.log(`TOTAL FRONTEND RBAC TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log(`=======================================================\n`);

