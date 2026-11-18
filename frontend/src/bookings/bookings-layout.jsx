import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BookingsHeader from "./bookings-header";
import BookingsHero from "./bookings-hero";
import BookingsList from "./bookings-list";
import BookingsBottomNav from "./bookings-bottom-nav";
import BookingsModalsManager from "./modals";
import { useUserBookings, formatBookingForUI } from "../queries/bookings-queries";
import { useBookingsStore } from "../stores/bookings-store";
import { useAuthStore } from "../stores/auth-store";

/**
 * Responsive & Dynamic BookingsLayout Page Component
 * Connects to user booking queries, provides auth validation, responsive desktop layout,
 * and handles modal interactions via Zustand store.
 * Strictly renders only bookings belonging to the authenticated logged-in user.
 */
export default function BookingsLayout({
  activeTab = "SERVICES",
}) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const openModal = useBookingsStore((state) => state.openModal);

  // TanStack Query for dynamic bookings
  const { data: dbBookings, isLoading, isError } = useUserBookings();

  // Format and strictly filter bookings belonging to the currently logged in user
  const bookings = useMemo(() => {
    if (!dbBookings || !Array.isArray(dbBookings)) {
      return [];
    }

    const currentUserId = String(user?._id || user?.id || "");

    return dbBookings
      .filter((raw) => {
        if (!raw) return false;
        // Strict client-side verification to ensure no leaked bookings
        if (currentUserId && raw.userId) {
          const bookingUserId = String(raw.userId?._id || raw.userId);
          if (bookingUserId && bookingUserId !== currentUserId) {
            return false;
          }
        }
        return true;
      })
      .map((raw, idx) => formatBookingForUI(raw, idx))
      .filter(Boolean);
  }, [dbBookings, user]);

  // Handle Card Primary Action (Reschedule / Rebook)
  const handlePrimaryAction = (booking) => {
    if (booking.status === "upcoming") {
      openModal("reschedule", booking);
    } else {
      // Rebook: redirect to salon services menu
      navigate("/salon/spafy");
    }
  };

  // Handle Card Secondary Action (QR Pass / Receipt)
  const handleSecondaryAction = (booking) => {
    if (booking.status === "upcoming") {
      openModal("qr", booking);
    } else {
      openModal("receipt", booking);
    }
  };

  // Handle Concierge Chat
  const handleContactConcierge = () => {
    openModal("concierge", null);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] text-[#1b1c19] flex flex-col justify-between font-sans antialiased selection:bg-[#4a3b32] selection:text-white">
      {/* Responsive App Shell: full width desktop, centered mobile */}
      <div className="w-full flex-1 flex flex-col">
        {/* Responsive Header */}
        <BookingsHeader brandLink="/salon/spafy" />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-between w-full max-w-6xl mx-auto px-0 sm:px-4 md:px-8">
          {/* Hero Section */}
          <BookingsHero
            badgeText="SANCTUARY PASS"
            title="Your Bookings"
            subtitle="Manage your upcoming sanctuary visits & rituals"
          />

          {/* Dark Scheduled Rituals Container */}
          <BookingsList
            bookings={bookings}
            totalCount={bookings.length}
            isLoading={isLoading}
            isError={isError}
            onPrimaryAction={handlePrimaryAction}
            onSecondaryAction={handleSecondaryAction}
            onContactConcierge={handleContactConcierge}
          />
        </main>
      </div>

      {/* Mobile-only Bottom Navigation (hidden on desktop md:) */}
      <div className="md:hidden">
        <BookingsBottomNav activeTab={activeTab} />
      </div>

      {/* Interactive Modal Manager (QR, Receipt, Reschedule, Concierge) */}
      <BookingsModalsManager />
    </div>
  );
}
