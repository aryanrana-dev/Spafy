import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * NotFoundHeader Component
 * Top navigation bar featuring the Spafy logo with shears icon,
 * desktop navigation links (Home, Sanctuary, Inquiries),
 * constellation node icon, and responsive mobile menu.
 */
export default function NotFoundHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-transparent sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
        {/* Brand Logo with Scissors/Shears Icon */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[#2b201a] group hover:opacity-85 transition-opacity"
        >
          {/* Scissors / Shears Icon */}
          <span className="material-symbols-outlined text-[20px] sm:text-[22px] font-light transform -rotate-45 block">
            content_cut
          </span>
          <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight">
            Spafy
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            <Link
              to="/salon/spafy"
              className="text-xs uppercase tracking-[0.18em] font-medium text-[#4a423b] hover:text-[#2b201a] transition-colors"
            >
              HOME
            </Link>
            <Link
              to="/salon/spafy"
              className="text-xs uppercase tracking-[0.18em] font-medium text-[#4a423b] hover:text-[#2b201a] transition-colors"
            >
              SANCTUARY
            </Link>
            <Link
              to="/salon/spafy"
              className="text-xs uppercase tracking-[0.18em] font-medium text-[#4a423b] hover:text-[#2b201a] transition-colors"
            >
              INQUIRIES
            </Link>
          </nav>

          {/* Connected Crossroads / Constellation Nodes Icon */}
          <button
            type="button"
            aria-label="Sanctuary Network"
            className="text-[#2b201a] hover:opacity-75 transition-opacity p-1 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Crossed connection lines */}
              <line x1="7" y1="7" x2="17" y2="17" />
              <line x1="17" y1="7" x2="7" y2="17" />
              {/* Four extremity node circles */}
              <circle cx="6" cy="6" r="2.2" fill="none" />
              <circle cx="18" cy="6" r="2.2" fill="none" />
              <circle cx="6" cy="18" r="2.2" fill="none" />
              <circle cx="18" cy="18" r="2.2" fill="none" />
            </svg>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="md:hidden text-[#2b201a] p-1.5 -mr-1.5 rounded-lg hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px] block">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-stone-200/60 px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/salon/spafy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-xs uppercase tracking-[0.18em] font-medium text-[#4a423b] hover:text-[#2b201a]"
          >
            HOME
          </Link>
          <Link
            to="/salon/spafy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-xs uppercase tracking-[0.18em] font-medium text-[#4a423b] hover:text-[#2b201a]"
          >
            SANCTUARY
          </Link>
          <Link
            to="/salon/spafy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-xs uppercase tracking-[0.18em] font-medium text-[#4a423b] hover:text-[#2b201a]"
          >
            INQUIRIES
          </Link>
        </div>
      )}
    </header>
  );
}

