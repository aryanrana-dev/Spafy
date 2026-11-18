import React from "react";

/**
 * Responsive Hero section for Bookings page
 * Mobile: Compact centered sanctuary header
 * Desktop: Grand luxury editorial sanctuary title & description
 */
export default function BookingsHero({
  badgeText = "SANCTUARY PASS",
  title = "Your Bookings",
  subtitle = "Manage your upcoming sanctuary visits & rituals",
}) {
  return (
    <section className="pt-3 pb-6 md:pt-8 md:pb-8 px-4 text-center max-w-3xl mx-auto">
      {/* Sanctuary Pass Pill Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#eae5dd] text-[#5c544d] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition-transform hover:scale-105">
        <span className="material-symbols-outlined text-[15px] leading-none text-[#42342b]">
          spa
        </span>
        <span className="text-[11px] font-semibold tracking-wider uppercase">
          {badgeText}
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="font-serif text-[32px] sm:text-4xl md:text-5xl font-normal text-[#2b201a] tracking-tight mt-3.5 md:mt-4 leading-tight">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="font-sans text-sm md:text-base text-[#736a62] mt-2 md:mt-2.5 max-w-md mx-auto leading-relaxed">
        {subtitle}
      </p>
    </section>
  );
}
