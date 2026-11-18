import React from "react";

/**
 * Responsive Concierge Banner component
 * Mobile: Sleek compact card with circular chat trigger.
 * Desktop: Grand full-width sanctuary concierge banner.
 */
export default function RitualConciergeCard({
  category = "RITUAL CONCIERGE",
  title = "Need bespoke\nscheduling?",
  description = "Our wellness advisors are available daily until 9 PM",
  onContact,
}) {
  return (
    <div className="bg-[#43372f] rounded-[22px] p-5 sm:p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl border border-white/10 transition-all">
      {/* Left Content */}
      <div className="min-w-0 max-w-xl">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#b8aba0] block">
          {category}
        </span>
        <h3 className="font-serif text-[22px] sm:text-2xl lg:text-3xl font-normal text-white leading-tight mt-1.5 whitespace-pre-line">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#a89b91] mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Right Action */}
      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={onContact}
          className="hidden sm:inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/30 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
        >
          <span>Speak With Advisor</span>
        </button>

        <button
          type="button"
          onClick={onContact}
          aria-label="Contact Ritual Concierge"
          className="bg-white hover:bg-[#fbf9f4] active:scale-95 text-[#2b201a] w-12 h-12 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center shadow-lg transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px] sm:text-[24px] leading-none">
            chat_bubble_outline
          </span>
        </button>
      </div>
    </div>
  );
}
