import React from "react";
import NotFoundHeader from "./not-found-header";
import NotFoundCard from "./not-found-card";
import NotFoundFooter from "./not-found-footer";

/**
 * NotFoundLayout Master Component
 * Assembles the full "Oops! Lost in the Spa?" 404 experience with
 * serene luxury aesthetic, responsive container, and organized subcomponents.
 */
export default function NotFoundLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between font-sans antialiased text-[#2b201a] relative overflow-hidden bg-gradient-to-br from-[#f2f6f4] via-[#faf8f5] to-[#f6f2eb] selection:bg-[#4a3b32] selection:text-white">
      {/* Ambient background glow layers */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#e3efe9]/60 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f7ede2]/50 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Top Navbar */}
      <NotFoundHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 z-10 w-full">
        <NotFoundCard />
      </main>

      {/* Sub-footer & Bottom Footer */}
      <NotFoundFooter />
    </div>
  );
}

