import { FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";

export default function Header({ services, showCart }) {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    return (
        <header className="fixed top-0 w-full z-50 bg-[#fbf9f4]/80 backdrop-blur-md border-b border-[#d2c4bd]/40">
            <div className="flex justify-between items-center px-6 py-4 w-full">
                <Link to="/salon/spafy" className="font-headline-md tracking-widest text-[#33251d]">
                    SPAFY
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[#4e4540] hidden sm:inline">
                                Hi, {user.fullName || user.name}
                            </span>
                            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4a3b32]/10 text-[#4a3b32] hidden md:inline">
                                {user.role === "admin" ? "Admin" : "User"}
                            </span>
                            <Link
                                to="/salon/bookings"
                                className="text-xs uppercase tracking-wider text-[#33251d] font-medium hover:underline hidden sm:inline"
                            >
                                Bookings
                            </Link>
                            {user.role === "admin" && (
                                <Link
                                    to={`/${user.salonSlug || "spafy"}/dashboard`}
                                    className="text-xs uppercase tracking-wider text-[#33251d] font-medium hover:underline hidden sm:inline"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="text-[11px] uppercase tracking-wider text-[#4e4540] hover:text-black border border-[#d2c4bd] px-2.5 py-1 rounded cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/salon/login"
                            className="text-xs uppercase tracking-wider text-[#33251d] font-medium hover:opacity-80"
                        >
                            Login
                        </Link>
                    )}

                    {services?.length > 0 && (
                        <button onClick={showCart} className="text-[#4e4540] hover:opacity-70 transition-opacity active:scale-95 duration-300 flex flex-row items-center gap-1 cursor-pointer">
                            <span className="font-body-sm tracking-widest hidden md:inline">Selected Services</span>
                            <span className="material-symbols-outlined">{<FaClipboardList size={22} />}</span>
                            <span className="bg-[#4a3b32] text-white text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {services.length}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}