import React from "react";
import { useBookingsStore } from "../stores/bookings-store";
import { useAuthStore } from "../stores/auth-store";

/**
 * QR Pass Modal for Upcoming Ritual
 */
function QrModal({ booking, onClose }) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="bg-[#fbf9f4] rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-black/10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-[#d2c4bd]/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#33251d] uppercase">
          <span className="material-symbols-outlined text-[16px]">spa</span>
          <span>SANCTUARY PASS</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#736a62] hover:text-black p-1 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="py-2">
        <h3 className="font-serif text-xl font-semibold text-[#2b201a]">
          {booking?.title || "Signature Rejuvenation Ritual"}
        </h3>
        <p className="text-xs text-[#736a62] mt-1">{booking?.date}</p>
        <p className="text-xs text-[#5c544d] font-medium mt-0.5">
          {typeof booking?.meta?.text === "string" ? booking.meta.text : "Suite 04 • Cedar Pavilion"}
        </p>
      </div>

      {/* QR Representation */}
      <div className="bg-white p-5 rounded-2xl inline-block shadow-inner border border-stone-200 mx-auto">
        <div className="w-44 h-44 bg-[#f8f6f0] border-2 border-dashed border-[#d2c4bd] rounded-xl flex flex-col items-center justify-center p-3">
          <span className="material-symbols-outlined text-6xl text-[#33251d]">
            qr_code_2
          </span>
          <span className="font-mono text-[10px] text-[#736a62] mt-1 tracking-widest">
            SPAFY-{booking?.id?.slice?.(-6)?.toUpperCase() || "7794B2"}
          </span>
        </div>
      </div>

      <div className="text-[11px] text-[#736a62] leading-relaxed max-w-[240px] mx-auto">
        Guest: <span className="font-semibold text-[#2b201a]">{user?.fullName || user?.name || "Elena Rostov"}</span>
        <br />
        Please present this pass at the sanctuary reception upon arrival.
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full bg-[#42342b] hover:bg-[#33251d] text-white py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
      >
        Done
      </button>
    </div>
  );
}

/**
 * Receipt Modal for Completed Ritual
 */
function ReceiptModal({ booking, onClose }) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="bg-[#fbf9f4] rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-black/10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-[#d2c4bd]/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#33251d] uppercase">
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          <span>RITUAL RECEIPT</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#736a62] hover:text-black p-1 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="text-center py-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#7d746c]">
          SPAFY SANCTUARY
        </span>
        <h3 className="font-serif text-xl font-semibold text-[#2b201a] mt-1">
          {booking?.title || "Completed Ritual"}
        </h3>
        <p className="text-xs text-[#736a62] mt-0.5">{booking?.date}</p>
      </div>

      {/* Itemized summary */}
      <div className="bg-[#f3ece4] rounded-xl p-3 text-xs space-y-2">
        <div className="flex justify-between text-[#5c544d]">
          <span>Client:</span>
          <span className="font-semibold text-[#2b201a]">{user?.fullName || user?.name || "Client"}</span>
        </div>
        <div className="flex justify-between text-[#5c544d]">
          <span>Service:</span>
          <span className="font-semibold text-[#2b201a]">{booking?.duration}</span>
        </div>
        <div className="flex justify-between text-[#5c544d]">
          <span>Practitioner:</span>
          <span className="font-semibold text-[#2b201a]">{booking?.displayPractitioner}</span>
        </div>
        <div className="border-t border-[#d2c4bd]/40 pt-2 flex justify-between font-bold text-sm text-[#2b201a]">
          <span>Total Paid:</span>
          <span>{booking?.price || "$145.00"}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => window.print?.()}
          className="flex-1 bg-[#eae4dc] hover:bg-[#ded6cb] text-[#2b201a] py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
        >
          Print
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-[#42342b] hover:bg-[#33251d] text-white py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/**
 * Concierge Chat Modal
 */
function ConciergeModal({ onClose }) {
  return (
    <div className="bg-[#fbf9f4] rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-black/10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-[#d2c4bd]/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#33251d] uppercase">
          <span className="material-symbols-outlined text-[16px]">forum</span>
          <span>RITUAL CONCIERGE</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#736a62] hover:text-black p-1 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="flex items-center gap-3 bg-[#f3ece4] rounded-2xl p-3">
        <div className="w-10 h-10 rounded-full bg-[#42342b] text-white flex items-center justify-center font-serif text-lg shrink-0">
          S
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#2b201a]">Sanctuary Concierge</h4>
          <p className="text-[11px] text-[#2e7d32] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" /> Available now
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 text-xs text-[#5c544d] space-y-2 border border-stone-200">
        <p className="leading-relaxed">
          Welcome to Spafy Bespoke Scheduling. How may our wellness advisors tailor your upcoming visit?
        </p>
        <div className="pt-2 flex flex-wrap gap-1.5">
          {["Change appointment time", "Switch therapist", "Add botanical treatment", "Special dietary requests"].map(
            (chip, i) => (
              <span
                key={i}
                className="bg-[#f3ece4] hover:bg-[#eae2d7] text-[#2b201a] text-[10px] font-medium px-2.5 py-1 rounded-full cursor-pointer"
              >
                {chip}
              </span>
            )
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full bg-[#42342b] hover:bg-[#33251d] text-white py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
      >
        Start Direct Chat
      </button>
    </div>
  );
}

/**
 * Reschedule confirmation modal
 */
function RescheduleModal({ booking, onClose }) {
  return (
    <div className="bg-[#fbf9f4] rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-black/10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-[#d2c4bd]/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#33251d] uppercase">
          <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
          <span>RESCHEDULE RITUAL</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#736a62] hover:text-black p-1 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div>
        <h3 className="font-serif text-lg font-semibold text-[#2b201a]">
          {booking?.title}
        </h3>
        <p className="text-xs text-[#736a62] mt-1">
          Currently booked for: <strong className="text-[#2b201a]">{booking?.date}</strong>
        </p>
      </div>

      <div className="bg-[#f3ece4] rounded-xl p-3 text-xs text-[#5c544d] space-y-2">
        <p className="leading-relaxed">
          Select preferred new time window. Our wellness team will confirm availability instantly without cancellation fees.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {["Tomorrow, 4:00 PM", "Tomorrow, 6:30 PM", "Day After, 11:00 AM", "Day After, 3:00 PM"].map((slot, i) => (
            <button
              key={i}
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-[#42342b] hover:text-white border border-[#d2c4bd]/50 rounded-lg p-2 text-[11px] font-medium text-center transition-colors cursor-pointer"
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full bg-[#42342b] hover:bg-[#33251d] text-white py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
      >
        Keep Current Time
      </button>
    </div>
  );
}

/**
 * Master Modal Manager
 */
export default function BookingsModalsManager() {
  const activeModal = useBookingsStore((state) => state.activeModal);
  const selectedBooking = useBookingsStore((state) => state.selectedBooking);
  const closeModal = useBookingsStore((state) => state.closeModal);

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {activeModal === "qr" && <QrModal booking={selectedBooking} onClose={closeModal} />}
      {activeModal === "receipt" && <ReceiptModal booking={selectedBooking} onClose={closeModal} />}
      {activeModal === "reschedule" && <RescheduleModal booking={selectedBooking} onClose={closeModal} />}
      {activeModal === "concierge" && <ConciergeModal onClose={closeModal} />}
    </div>
  );
}

