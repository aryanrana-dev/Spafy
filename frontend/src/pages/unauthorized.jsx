import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";

export default function Unauthorized({ requiredRoles = [] }) {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const userRole = (user?.role === "owner" ? "salon" : user?.role) || "guest";
    const salonSlug = user?.salonSlug || "spafy";

    const handleSwitchAccount = async () => {
        await logout();
        navigate("/salon/login");
    };

    return (
        <div className="min-h-screen bg-[#fbf9f4] flex flex-col justify-between font-serif text-[#33251d]">
            {/* Header */}
            <header className="px-6 py-6 border-b border-[#d2c4bd]/40 flex justify-between items-center">
                <Link to="/salon/spafy" className="font-serif tracking-widest text-xl font-semibold">
                    SPAFY
                </Link>
                {user && (
                    <div className="flex items-center gap-3 font-sans text-xs">
                        <span className="text-[#6c5e53]">Signed in as:</span>
                        <span className="font-semibold px-2 py-0.5 rounded bg-[#4a3b32]/10 uppercase tracking-wider">
                            {userRole}
                        </span>
                    </div>
                )}
            </header>

            {/* Central Card */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-2xl p-8 md:p-10 shadow-[0_4px_24px_rgba(74,59,50,0.06)] border border-[#d2c4bd]/50 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center text-[#ba1a1a]">
                        <span className="material-symbols-outlined text-3xl">lock</span>
                    </div>

                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-sans font-semibold tracking-widest uppercase bg-[#ba1a1a]/10 text-[#ba1a1a] mb-3">
                        403 • Access Restricted
                    </span>

                    <h1 className="text-2xl md:text-3xl font-serif font-medium mb-3">
                        Permission Denied
                    </h1>

                    <p className="font-sans text-sm text-[#6c5e53] mb-6 leading-relaxed">
                        {userRole === "user" && (
                            <>
                                Your account is registered as a <strong className="text-[#33251d]">User / Customer</strong>.
                                Users can only access salon booking pages, appointments, and checkout. You do not have permission to view partner dashboards.
                            </>
                        )}
                        {userRole === "salon" && (
                            <>
                                Your account is registered as a <strong className="text-[#33251d]">Salon Partner</strong>.
                                Salon accounts can only access their salon dashboard. Client booking and checkout pages are reserved for customers.
                            </>
                        )}
                        {userRole === "guest" && (
                            <>
                                Authentication required. Please log in with an authorized account to access this page.
                            </>
                        )}
                        {userRole === "admin" && (
                            <>
                                Admin privilege check: This page requires specific permissions: [{requiredRoles.join(", ")}].
                            </>
                        )}
                    </p>

                    {/* Action buttons based on Role */}
                    <div className="flex flex-col gap-3 font-sans text-xs">
                        {userRole === "user" && (
                            <>
                                <Link
                                    to="/salon/spafy"
                                    className="w-full bg-[#4a3b32] text-white py-3 rounded-lg font-medium tracking-widest uppercase hover:bg-[#33251d] transition-colors"
                                >
                                    Browse Salon Services
                                </Link>
                                <Link
                                    to="/salon/bookings"
                                    className="w-full border border-[#d2c4bd] py-3 rounded-lg font-medium tracking-widest uppercase text-[#33251d] hover:bg-[#fbf9f4] transition-colors"
                                >
                                    View Your Bookings
                                </Link>
                            </>
                        )}

                        {userRole === "salon" && (
                            <Link
                                to={`/${salonSlug}/dashboard`}
                                className="w-full bg-[#4a3b32] text-white py-3 rounded-lg font-medium tracking-widest uppercase hover:bg-[#33251d] transition-colors"
                            >
                                Go to Salon Dashboard
                            </Link>
                        )}

                        {userRole === "guest" && (
                            <Link
                                to="/salon/login"
                                className="w-full bg-[#4a3b32] text-white py-3 rounded-lg font-medium tracking-widest uppercase hover:bg-[#33251d] transition-colors"
                            >
                                Log In to Continue
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={handleSwitchAccount}
                            className="mt-2 text-xs text-[#7d6f64] hover:text-[#33251d] underline cursor-pointer"
                        >
                            Sign in with a different account
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center font-sans text-[11px] text-[#8e8075] border-t border-[#d2c4bd]/20">
                Spafy Role-Based Access Control • Secure Gateway
            </footer>
        </div>
    );
}

