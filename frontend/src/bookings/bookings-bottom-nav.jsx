import React from "react";
import { Link } from "react-router-dom";

/**
 * Dumb Bottom Navigation component matching the mobile app bar.
 */
export default function BookingsBottomNav({ activeTab = "SERVICES" }) {
  const navItems = [
    { id: "HOME", icon: "home_max", label: "HOME", to: "/salon/spafy" },
    { id: "SERVICES", icon: "spa", label: "SERVICES", to: "/salon/spafy" },
    { id: "BOOKINGS", icon: "calendar_month", label: "BOOKINGS", to: "/salon/bookings" },
    { id: "PROFILE", icon: "person", label: "PROFILE", to: "/salon/login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 bg-[#fbf9f4] border-t border-[#d2c4bd]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center w-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`flex flex-col items-center justify-center transition-colors active:scale-90 duration-200 ${
                isActive
                  ? "text-[#33251d] font-bold"
                  : "text-[#51625e] opacity-60 hover:opacity-90"
              }`}
            >
              <span
                className="material-symbols-outlined mb-1"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-sm uppercase tracking-widest text-[11px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

