import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";
import { useBookingsStore } from "../stores/bookings-store";
import { useServicesStore } from "../stores/services-store";

/**
 * Responsive Header component for Bookings section
 * Mobile: Clean minimal app bar with hamburger, brand, bag.
 * Desktop: Luxury nav bar with brand, page navigation links, user greeting, and cart.
 */
export default function BookingsHeader({
  brandLink = "/salon/spafy",
  onBagClick,
}) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isMobileMenuOpen = useBookingsStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useBookingsStore((state) => state.toggleMobileMenu);
  const closeMobileMenu = useBookingsStore((state) => state.closeMobileMenu);
  const services = useServicesStore((state) => state.services);
  const toggleCart = useServicesStore((state) => state.toggle);

  const handleBag = () => {
    if (onBagClick) {
      onBagClick();
    } else {
      toggleCart();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/salon/login");
  };

  return (
    <header className="w-full bg-[#fbf9f4]/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#d2c4bd]/20 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Left: Mobile hamburger & Desktop Brand */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            className="md:hidden text-[#2b201a] p-1.5 -ml-1 rounded-lg hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px] block">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>

          {/* Desktop Brand Logo */}
          <Link
            to={brandLink}
            className="hidden md:flex items-center gap-2 group"
          >
            <span className="font-serif text-2xl font-medium tracking-[0.25em] text-[#2b201a] group-hover:opacity-85 transition-opacity">
              SPAFY
            </span>
            <span className="text-[10px] tracking-widest text-[#736a62] uppercase font-semibold pl-2 border-l border-[#d2c4bd]/60">
              SANCTUARY
            </span>
          </Link>
        </div>

        {/* Center: Mobile Brand Logo & Desktop Navigation */}
        <div className="flex items-center">
          {/* Mobile Brand */}
          <Link
            to={brandLink}
            className="md:hidden font-serif text-[22px] font-medium tracking-[0.22em] text-[#2b201a] select-none hover:opacity-85 transition-opacity"
          >
            SPAFY
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/salon/spafy"
              className="text-xs uppercase tracking-widest text-[#5c544d] hover:text-[#2b201a] transition-colors py-1"
            >
              Services
            </Link>
            <Link
              to="/salon/bookings"
              className="text-xs uppercase tracking-widest text-[#2b201a] font-bold py-1 border-b-2 border-[#2b201a]"
            >
              Your Bookings
            </Link>
            {(user?.role === "admin" || user?.role === "salon" || user?.role === "owner") && (
              <Link
                to={`/${user?.salonSlug || "spafy"}/dashboard`}
                className="text-xs uppercase tracking-widest text-[#5c544d] hover:text-[#2b201a] transition-colors py-1"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Right: User profile chip, logout & Bag trigger */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop User Greeting & Logout */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-[#5c544d]">
                Welcome, <strong className="text-[#2b201a]">{user.fullName || user.name || "Guest"}</strong>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[11px] uppercase tracking-wider text-[#5c544d] hover:text-[#2b201a] border border-[#d2c4bd]/80 px-2.5 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}

          {/* Shopping Bag Button */}
          <button
            type="button"
            onClick={handleBag}
            aria-label="View shopping bag"
            className="text-[#2b201a] p-1.5 -mr-1 rounded-lg hover:bg-black/5 active:scale-95 transition-all relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] block font-light">
              shopping_bag
            </span>
            {services?.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#42342b] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {services.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#d2c4bd]/30 bg-[#fbf9f4] px-5 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <Link
              to="/salon/spafy"
              onClick={closeMobileMenu}
              className="block py-2 text-xs uppercase tracking-widest text-[#5c544d] hover:text-[#2b201a]"
            >
              Services & Rituals
            </Link>
            <Link
              to="/salon/bookings"
              onClick={closeMobileMenu}
              className="block py-2 text-xs uppercase tracking-widest text-[#2b201a] font-bold"
            >
              Your Bookings
            </Link>
            {(user?.role === "admin" || user?.role === "salon" || user?.role === "owner") && (
              <Link
                to={`/${user?.salonSlug || "spafy"}/dashboard`}
                onClick={closeMobileMenu}
                className="block py-2 text-xs uppercase tracking-widest text-[#5c544d] hover:text-[#2b201a]"
              >
                Salon Dashboard
              </Link>
            )}
          </div>

          {user && (
            <div className="pt-3 border-t border-[#d2c4bd]/30 flex items-center justify-between">
              <span className="text-xs text-[#5c544d]">
                Hi, <strong>{user.fullName || user.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[11px] uppercase tracking-wider text-[#b71c1c] font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
