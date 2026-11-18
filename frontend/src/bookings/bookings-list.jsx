import React from "react";
import { Link } from "react-router-dom";
import BookingCard from "./booking-card";
import RitualConciergeCard from "./ritual-concierge-card";
import { useBookingsStore } from "../stores/bookings-store";

/**
 * Skeleton Card for loading state
 */
function BookingSkeleton() {
  return (
    <div className="bg-[#fbf9f4]/90 rounded-[22px] p-5 shadow-sm space-y-4 animate-pulse border border-black/5">
      <div className="flex justify-between items-center">
        <div className="h-5 w-24 bg-stone-200 rounded-full" />
        <div className="h-4 w-16 bg-stone-200 rounded" />
      </div>
      <div className="flex gap-3.5 items-center">
        <div className="w-20 h-20 rounded-xl bg-stone-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-3/4 bg-stone-200 rounded" />
          <div className="h-3 w-1/2 bg-stone-200 rounded" />
          <div className="h-3 w-2/3 bg-stone-200 rounded" />
        </div>
      </div>
      <div className="h-9 w-full bg-stone-200 rounded-xl" />
      <div className="flex gap-2">
        <div className="h-11 flex-1 bg-stone-300 rounded-xl" />
        <div className="h-11 w-12 bg-stone-200 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Responsive BookingsList component
 * Container for scheduled rituals with filters, responsive grid, loading & empty states.
 */
export default function BookingsList({
  bookings = [],
  totalCount,
  isLoading = false,
  isError = false,
  onPrimaryAction,
  onSecondaryAction,
  onContactConcierge,
}) {
  const currentFilter = useBookingsStore((state) => state.filter);
  const setFilter = useBookingsStore((state) => state.setFilter);

  // Filter bookings based on selected tab
  const filteredBookings = (bookings || []).filter((b) => {
    if (!b) return false;
    if (currentFilter === "upcoming") return b.status === "upcoming";
    if (currentFilter === "completed") return b.status === "completed" || b.status === "cancelled";
    return true;
  });

  const displayCount = totalCount ?? filteredBookings.length;

  return (
    <div className="w-full bg-[#2b201a] rounded-t-[32px] md:rounded-[36px] px-4 sm:px-6 lg:px-10 pt-4 pb-24 md:pb-12 shadow-2xl transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Mobile Drag Notch Handle */}
        <div className="w-12 h-1 bg-[#473a32] rounded-full mx-auto md:hidden" />

        {/* Section Header with Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 pb-1">
          {/* Left: Section Indicator & Title */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fbf9f4] shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fbf9f4]">
              SCHEDULED RITUALS
            </h2>
          </div>

          {/* Right: Filter Buttons & Total Count */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            {/* Filter Tabs */}
            <div className="inline-flex items-center bg-[#3a2e26] p-1 rounded-xl text-[11px] font-semibold tracking-wider">
              {[
                { id: "all", label: "ALL" },
                { id: "upcoming", label: "UPCOMING" },
                { id: "completed", label: "COMPLETED" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                    currentFilter === tab.id
                      ? "bg-[#fbf9f4] text-[#2b201a] shadow-sm font-bold"
                      : "text-[#c4b6ab] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Total Count Pill */}
            <span className="bg-[#3e322a] text-[#c4b6ab] text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase shrink-0">
              {displayCount} TOTAL
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="bg-[#3d2f26] rounded-2xl p-6 text-center text-stone-300 space-y-2 border border-white/5">
            <span className="material-symbols-outlined text-3xl text-amber-400">
              error_outline
            </span>
            <p className="text-sm">Unable to retrieve appointments at this moment.</p>
            <p className="text-xs text-stone-400">
              Please check your connection or contact our sanctuary concierge.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredBookings.length === 0 && (
          <div className="bg-[#3a2e26] rounded-2xl p-8 sm:p-12 text-center text-stone-300 space-y-4 border border-white/5 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#d2c4bd]">
              <span className="material-symbols-outlined text-3xl">spa</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-white">
                No Scheduled Rituals
              </h3>
              <p className="text-xs sm:text-sm text-[#b0a398] mt-1 max-w-xs mx-auto">
                {currentFilter === "all"
                  ? "You do not have any sanctuary visits scheduled at the moment."
                  : `No ${currentFilter} rituals found in your sanctuary pass.`}
              </p>
            </div>
            <Link
              to="/salon/spafy"
              className="inline-flex items-center gap-2 bg-[#fbf9f4] hover:bg-white text-[#2b201a] px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors"
            >
              <span>Explore Sanctuary Menu</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        )}

        {/* Responsive Grid of Ritual Cards */}
        {!isLoading && filteredBookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onPrimaryAction={onPrimaryAction}
                onSecondaryAction={onSecondaryAction}
              />
            ))}
          </div>
        )}

        {/* Ritual Concierge Card Banner */}
        <div className="pt-2">
          <RitualConciergeCard onContact={onContactConcierge} />
        </div>
      </div>
    </div>
  );
}
