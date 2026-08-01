export const MetricCard = ({ title, value, subtext, icon, trend, children }) => (
  <div className="bg-white rounded-xl p-6 hairline-border flex flex-col justify-between">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#d4e7e1] flex items-center justify-center text-[#576864]">
          <span className="material-symbols-outlined text-sm">{icon}</span>
        </div>
        <h3 className="text-sm font-medium text-[#4e4540] uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
    <div>
      <p className="text-5xl font-serif text-[#1b1c19]">{value}</p>
      {trend && (
        <p className="text-xs text-[#51625e] mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">trending_up</span> {trend}
        </p>
      )}
      {subtext && (
        <a href="#" className="text-xs font-medium text-[#33251d] hover:text-[#51625e] mt-4 inline-flex items-center gap-1 uppercase tracking-widest border-b border-transparent transition-all">
          {subtext} <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </a>
      )}
    </div>
  </div>
);

export const AppointmentCard = () => (
  <div className="bg-[#4a3b32] rounded-xl p-6 flex flex-col justify-between text-white relative overflow-hidden">
    <div className="relative z-10">
      <h3 className="text-sm font-medium text-[#d9c2b6] uppercase tracking-wider mb-6">Up Next</h3>
      <p className="text-3xl font-serif text-[#f6ded1] mb-1">10:30 AM</p>
      <p className="text-base text-[#baa599] mb-4">Sarah Jenkins</p>
      <div className="inline-block border border-[#d6c5a5]/30 rounded-full px-4 py-1 text-xs text-[#f3e0bf] uppercase">
        Signature Facial
      </div>
    </div>
    <button className="relative z-10 mt-8 w-full bg-[#f3e0bf] text-[#33251d] px-4 py-3 rounded-lg text-sm font-medium hover:bg-[#d6c5a5] transition-colors uppercase tracking-widest">
      Prepare Room
    </button>
  </div>
);