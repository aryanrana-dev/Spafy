export default function Sidebar() {
  return (
    <aside id="sidenav" className="h-screen w-64 fixed left-0 top-0 overflow-y-auto border-r border-outline-variant/40 bg-[#33251d] z-50 flex flex-col py-2 px-4 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-12 mt-4 px-2">
        <div>
          <h1 className="text-2xl font-serif text-[#f6ded1] tracking-tight">Modern Sanctuary</h1>
          <p className="text-xs text-[#d9c2b6] mt-1">Partner Portal</p>
        </div>
        <button className="md:hidden text-[#f6ded1] p-1">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon="dashboard" label="Dashboard" active />
        <NavItem icon="payments" label="Payment History" />
        <NavItem icon="event_list" label="Booking Queue" />
        <NavItem icon="analytics" label="Service Stats" />
        <NavItem icon="mail" label="Contact Us" />
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10 px-2 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden hairline-border">
            <img alt="Salon Logo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2kpeEY_bMXWp2Ful19tR2pP6PtG0uncfJs45P1oy8TFNvWGPpAU0eDQa7pXIxOUXPAHFjLO-VCEwHL-fMS_N4aaQEhI-UGvsDq7Lx2ZmsIA3KVdUkoZD3ZmcfFcKxbNNlmSg8e0rlP279QQ7vCT6r2je_ZKvjeskvvc1J30UIU5boRYuJMmCgTC0g6G_agWnaCIGTJnSl02rQbUglMjZ3Sp8Vpns_J6wfFooyl1jABLqJqMLusyCRddFu6rRPe_n4Fh2yvMoNlQ1v" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#f6ded1]">Eleanor Spa</p>
            <p className="text-xs text-[#d9c2b6]">Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
};

const NavItem = ({ icon, label, active }) => (
  <a href="#" className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${active ? 'text-[#f6ded1] bg-[#4a3b32]/30 border-r-2 border-[#f3e0bf] font-bold' : 'text-[#baa599]/70 hover:text-[#f6ded1] hover:bg-[#4a3b32]/20'}`}>
    <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "" }}>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </a>
);
