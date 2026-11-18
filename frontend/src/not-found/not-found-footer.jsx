import React from "react";
import { Link } from "react-router-dom";

/**
 * NotFoundFooter Component
 * Renders the serenity navigation status indicator code and the luxury brand footer.
 */
export default function NotFoundFooter() {
  return (
    <footer className="w-full mt-auto pt-6 pb-6 sm:pb-8 px-6 sm:px-8">
      {/* Sub-footer Serene Navigation Code */}
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-[#9c938a] uppercase">
          SPAFY SERENE NAVIGATION • STATUS 404 • CODE: HAVEN_UNAVAILABLE
        </p>
      </div>

      {/* Main Luxury Bottom Footer */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] tracking-wider text-[#9c938a] uppercase border-t border-stone-200/50 pt-5 sm:pt-6">
        {/* Copyright */}
        <p className="text-center sm:text-left">
          &copy; 2024 SPAFY LUXURY WELLNESS. ALL RIGHTS RESERVED.
        </p>

        {/* Footer Navigation Links */}
        <nav className="flex items-center gap-6 sm:gap-8 tracking-[0.2em] font-medium text-[#6e655e]">
          <Link
            to="/privacy"
            className="hover:text-[#2b201a] transition-colors"
          >
            PRIVACY
          </Link>
          <Link
            to="/terms"
            className="hover:text-[#2b201a] transition-colors"
          >
            TERMS
          </Link>
          <Link
            to="/concierge"
            className="hover:text-[#2b201a] transition-colors"
          >
            CONCIERGE
          </Link>
        </nav>
      </div>
    </footer>
  );
}

