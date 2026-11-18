import React from "react";

/**
 * Responsive BookingCard component
 * Adapts seamlessly between mobile single-column and desktop grid layouts.
 */
export default function BookingCard({
  booking,
  onPrimaryAction,
  onSecondaryAction,
}) {
  if (!booking) return null;

  const isUpcoming = booking.status === "upcoming";

  const renderLocationText = () => {
    if (typeof booking.meta?.text === "string") {
      return booking.meta.text;
    }
    if (booking.meta?.text && typeof booking.meta.text === "object") {
      const parts = [
        booking.meta.text.street,
        booking.meta.text.city,
        booking.meta.text.pincode,
      ].filter(Boolean);
      return parts.join(", ") || "Sanctuary Pavilion";
    }
    return "Sanctuary Pavilion";
  };

  return (
    <article className="bg-[#fbf9f4] rounded-[22px] p-4 sm:p-5 shadow-sm border border-black/5 flex flex-col justify-between space-y-3.5 hover:shadow-md transition-shadow">
      {/* Status Header */}
      <div className="flex items-center justify-between text-xs">
        {/* Status Badge */}
        {isUpcoming ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#dbeee7] text-[#1b5847]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1b5847] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {booking.statusLabel || "UPCOMING"}
            </span>
          </div>
        ) : (
          <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
            booking.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-[#ece7df] text-[#635b53]"
          }`}>
            <span className="material-symbols-outlined text-[14px] leading-none">
              {booking.statusIcon || "check"}
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {booking.statusLabel || "COMPLETED"}
            </span>
          </div>
        )}

        {/* Right Status / Month */}
        {isUpcoming ? (
          <div className="flex items-center gap-1 text-[#2b201a]">
            <span className="material-symbols-outlined text-[14px]">
              {booking.statusIcon || "schedule"}
            </span>
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              {booking.statusSubtext || "CONFIRMED"}
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-bold tracking-widest text-[#847b73] uppercase">
            {booking.statusSubtext}
          </span>
        )}
      </div>

      {/* Main Info Row: Thumbnail + Details */}
      <div className="flex items-center gap-3.5">
        {/* Thumbnail */}
        <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-[#e8e2d8] shrink-0 shadow-inner flex items-center justify-center">
          <img
            src={booking.image}
            alt={booking.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.parentElement?.querySelector(".fallback-icon");
              if (fallback) fallback.classList.remove("hidden");
            }}
          />
          <span className="material-symbols-outlined text-[#736a62] text-2xl hidden fallback-icon">
            spa
          </span>
        </div>

        {/* Title, Date, Specialist */}
        <div className="flex-1 min-w-0">
          <h2
            className="font-serif text-[17px] sm:text-[18px] font-semibold text-[#2b201a] tracking-tight truncate leading-snug"
            title={booking.title}
          >
            {booking.displayTitle || booking.title}
          </h2>

          {/* Date & Time */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2b201a] mt-1">
            <span className="material-symbols-outlined text-[14px] text-[#5c544d] leading-none">
              calendar_today
            </span>
            <span className="truncate">{booking.date}</span>
          </div>

          {/* Duration & Specialist */}
          <p className="text-xs text-[#736a62] mt-0.5 truncate">
            {booking.duration} •{" "}
            {booking.displayPractitioner ||
              `${booking.practitionerRole || "Practitioner"}: ${booking.practitionerName}`}
          </p>
        </div>
      </div>

      {/* Meta Strip: Location, Rating, or Extra Detail + Price */}
      <div className="bg-[#f3ece4] rounded-xl px-3 py-2 flex items-center justify-between text-xs text-[#5c544d]">
        <div className="flex items-center gap-1.5 min-w-0">
          {booking.meta?.type === "rating" ? (
            <div className="flex items-center gap-1">
              {/* 5 star outlines */}
              <div className="flex items-center text-[#2b201a]">
                {[...Array(5)].map((_, idx) => (
                  <span
                    key={idx}
                    className="material-symbols-outlined text-[13px] leading-none"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="ml-1 text-xs text-[#5c544d] font-medium">
                {renderLocationText()}
              </span>
            </div>
          ) : (
            <>
              {booking.meta?.icon && (
                <span className="material-symbols-outlined text-[14px] text-[#5c544d] leading-none shrink-0">
                  {booking.meta.icon}
                </span>
              )}
              <span className="truncate">{renderLocationText()}</span>
            </>
          )}
        </div>

        {/* Price */}
        <span className="font-semibold text-[#2b201a] shrink-0 ml-2">
          {booking.price}
        </span>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 pt-1 mt-auto">
        {/* Primary Action Button */}
        {booking.primaryAction && (
          <button
            type="button"
            onClick={() => onPrimaryAction?.(booking)}
            className="bg-[#42342b] hover:bg-[#34271f] active:scale-[0.99] text-white py-3 px-4 rounded-xl flex-1 flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
          >
            {booking.primaryAction.icon && (
              <span className="material-symbols-outlined text-[15px] leading-none">
                {booking.primaryAction.icon}
              </span>
            )}
            <span>{booking.primaryAction.label}</span>
          </button>
        )}

        {/* Secondary Action Button (QR or Receipt) */}
        {booking.secondaryAction && (
          <button
            type="button"
            onClick={() => onSecondaryAction?.(booking)}
            aria-label={booking.secondaryAction.ariaLabel || "Action"}
            className="bg-[#eae4dc] hover:bg-[#ded6cb] active:scale-[0.97] text-[#2b201a] w-12 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] leading-none">
              {booking.secondaryAction.icon}
            </span>
          </button>
        )}
      </div>
    </article>
  );
}
