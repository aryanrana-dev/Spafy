import React from "react";
import { Link } from "react-router-dom";

/**
 * NotFoundCard Component
 * Central card containing the 404 Detour badge, character illustration,
 * headline, description, primary action buttons, and assistance links.
 */
export default function NotFoundCard() {
  return (
    <div className="bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-[#ede9e2]/80 p-6 sm:p-10 md:p-12 max-w-2xl w-full mx-auto text-center relative transition-all">
      {/* Pill Badge: 404 Detour in Paradise */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#f1ece5] text-[#6e655d] text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6e655d]" />
        <span>404 • DETOUR IN PARADISE</span>
      </div>

      {/* Back Chevron Above Card */}
      <div className="w-48 sm:w-56 mx-auto flex items-center justify-start text-[#a39a90] text-sm mt-3 mb-1">
        <Link
          to="/"
          aria-label="Go back"
          className="hover:text-[#2b201a] transition-colors p-0.5"
        >
          <span className="material-symbols-outlined text-[18px] block">
            chevron_left
          </span>
        </Link>
      </div>

      {/* Spa Character Card Container */}
      <div className="relative w-48 h-56 sm:w-56 sm:h-64 bg-[#f6f4ee] rounded-2xl mx-auto flex flex-col items-center justify-center p-5 border border-[#ede9e2]/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.02)]">
        {/* Top-Right Sparkle */}
        <span className="text-[#a39a90] text-sm absolute top-3.5 right-3.5 select-none font-serif">
          ✦
        </span>

        {/* Bottom-Left Pastel Mint Dot */}
        <span className="w-3 h-3 rounded-full bg-[#d0e5df] absolute bottom-3.5 left-3.5" />

        {/* Peaceful Spa Character Illustration */}
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Stylized Spa Character SVG */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            <svg
              className="w-full h-full drop-shadow-sm"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Lost Spa Character 404"
            >
              {/* Soft spa steam ripples */}
              <path
                d="M48 20C48 20 52 14 60 14C68 14 72 20 72 20"
                stroke="#c9bfb2"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="animate-pulse"
              />
              <path
                d="M54 26C54 26 57 22 62 22C67 22 70 26 70 26"
                stroke="#c9bfb2"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Head towel wrap / turban */}
              <path
                d="M34 50C34 38 46 32 60 32C74 32 86 38 86 50C86 52 84 54 80 54H40C36 54 34 52 34 50Z"
                fill="#fcfbfa"
                stroke="#d2c8bc"
                strokeWidth="1.5"
              />
              <circle cx="60" cy="32" r="5" fill="#eae4dc" stroke="#d2c8bc" strokeWidth="1.5" />

              {/* Serene Character Face */}
              <rect
                x="38"
                y="52"
                width="44"
                height="42"
                rx="21"
                fill="#f8ece0"
                stroke="#d9cebf"
                strokeWidth="1.5"
              />

              {/* Soothing Cucumber Slice Eye Masks */}
              <circle cx="49" cy="67" r="7" fill="#d4e8dd" stroke="#a7cdb8" strokeWidth="1.5" />
              <circle cx="49" cy="67" r="3" fill="#badbc7" />
              <circle cx="71" cy="67" r="7" fill="#d4e8dd" stroke="#a7cdb8" strokeWidth="1.5" />
              <circle cx="71" cy="67" r="3" fill="#badbc7" />

              {/* Soft Blush Cheeks */}
              <circle cx="42" cy="77" r="3.5" fill="#f5cfc4" opacity="0.7" />
              <circle cx="78" cy="77" r="3.5" fill="#f5cfc4" opacity="0.7" />

              {/* Peaceful curved smile */}
              <path
                d="M55 79C55 79 58 83 60 83C62 83 65 79 65 79"
                stroke="#8c7e70"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Fluffy Bathrobe Collar */}
              <path
                d="M36 94C36 94 48 98 60 98C72 98 84 94 84 94L88 106H32L36 94Z"
                fill="#ffffff"
                stroke="#d2c8bc"
                strokeWidth="1.5"
              />
              <path
                d="M48 97L60 106L72 97"
                stroke="#c9bfb2"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Character Label */}
          <span className="text-[11px] font-sans font-medium text-[#8c8277] tracking-wide select-none">
            Lost Spa Character 404
          </span>
        </div>
      </div>

      {/* Decorative Warm Sand Dot Outside Box */}
      <div className="w-2 h-2 rounded-full bg-[#d9d0c5] mx-auto mt-3" />

      {/* Headline */}
      <h1 className="font-serif text-3xl sm:text-4xl md:text-[44px] font-medium text-[#2b201a] tracking-tight leading-tight mt-4 mb-3">
        Oops! Lost in the Spa?
      </h1>

      {/* Subtitle / Explanation */}
      <p className="font-sans text-xs sm:text-sm md:text-[15px] text-[#6e655e] max-w-lg mx-auto leading-relaxed">
        You seem to have wandered in the wrong direction. No salon by this name has partnered with
        us yet. Maybe you can let them know about Spafy the next time you see them!
      </p>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-7 sm:mt-8">
        {/* Button 1: Browse Partnered Salons (Dark Espresso) */}
        <Link
          to="/salon/spafy"
          className="w-full sm:w-auto bg-[#2b201a] hover:bg-[#1f1712] text-white py-3 px-6 rounded-xl flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer group"
        >
          {/* Target / Reticle Icon */}
          <span className="material-symbols-outlined text-[18px] leading-none shrink-0 text-white/90">
            adjust
          </span>
          <div className="text-left leading-tight text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
            <div>BROWSE</div>
            <div>PARTNERED</div>
            <div>SALONS</div>
          </div>
        </Link>

        {/* Button 2: Invite a Salon (Light Mint/Sage) */}
        <Link
          to="/salon/register"
          className="w-full sm:w-auto bg-[#f0f5f3] hover:bg-[#e4edea] text-[#3f5249] py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer text-xs sm:text-[13px] font-bold tracking-wider uppercase group"
        >
          {/* Send / Triangle Paper Plane Icon */}
          <span className="material-symbols-outlined text-[16px] leading-none shrink-0 group-hover:translate-x-0.5 transition-transform">
            send
          </span>
          <span>INVITE A SALON</span>
        </Link>
      </div>

      {/* Bottom Assistance Section */}
      <div className="pt-6 sm:pt-8 mt-7 sm:mt-8 border-t border-[#ede9e2]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d746c]">
        {/* Left Label */}
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9c938a] text-center sm:text-left leading-tight">
          <div>NEED</div>
          <div>ASSISTANCE?</div>
        </div>

        {/* Center / Right Links */}
        <div className="flex flex-col items-center sm:items-end gap-1.5 text-center sm:text-right">
          {/* ========================================================================= */}
          {/* HEADING: Search Sanctuary Directory & Contact Concierge (Commented Out)   */}
          {/* ========================================================================= */}
          {/*
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end text-xs">
            <a
              href="/sanctuary-directory"
              className="text-[#6e655e] hover:text-[#2b201a] transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>Search Sanctuary Directory</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
            <span className="text-stone-300">•</span>
            <a
              href="/concierge"
              className="text-[#6e655e] hover:text-[#2b201a] transition-colors font-medium"
            >
              Contact Concierge
            </a>
            <span className="text-stone-300">•</span>
          </div>
          */}

          {/* Active Return to Home Navigation */}
          <Link
            to="/"
            className="text-xs text-[#5c544d] hover:text-[#2b201a] transition-colors font-medium hover:underline underline-offset-4"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

