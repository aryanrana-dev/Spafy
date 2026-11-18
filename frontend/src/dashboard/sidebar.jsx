import { useAuthStore } from "../stores/auth-store";

export default function Sidebar({ salonName = "spafy" }) {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.fullName || user?.name || "Eleanor Vance";
  const userRole = (user?.role === "owner" ? "salon" : user?.role) || "salon";

  const formattedName = salonName
    ? salonName.charAt(0).toUpperCase() + salonName.slice(1)
    : "Modern Sanctuary";

  return (
    <aside id="sidenav" className="h-screen w-64 fixed left-0 top-0 overflow-y-auto border-r border-outline-variant/40 bg-[#33251d] z-50 flex flex-col py-2 px-4 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-12 mt-4 px-2">
        <div>
          <h1 className="text-2xl font-serif text-[#f6ded1] tracking-tight">{formattedName}</h1>
          <p className="text-xs text-[#d9c2b6] mt-1">Salon Partner Portal</p>
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
          <div className="w-10 h-10 rounded-full overflow-hidden hairline-border bg-[#4a3b32] flex items-center justify-center text-[#f6ded1] font-serif font-bold text-sm">
            {displayName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-[#f6ded1] truncate max-w-[150px]">{displayName}</p>
            <p className="text-xs text-[#d9c2b6] capitalize">
              {userRole === "admin" ? "Super Admin" : "Salon Manager"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

const NavItem = ({ icon, label, active }) => (
  <a href="#" className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${active ? 'text-[#f6ded1] bg-[#4a3b32]/30 border-r-2 border-[#f3e0bf] font-bold' : 'text-[#baa599]/70 hover:text-[#f6ded1] hover:bg-[#4a3b32]/20'}`}>
    <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "" }}>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </a>
);
