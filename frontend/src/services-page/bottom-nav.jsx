import { Link } from "react-router-dom";

export default function BottomNav({ activeTab = "SERVICES" }) {
    const navItems = [
        { icon: 'home_max', label: 'HOME', to: '/salon/spafy' },
        { icon: 'spa', label: 'SERVICES', to: '/salon/spafy' },
        { icon: 'calendar_month', label: 'BOOKINGS', to: '/salon/bookings' },
        { icon: 'person', label: 'PROFILE', to: '/salon/login' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 bg-[#fbf9f4] rounded-t-xl border-t border-[#d2c4bd]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            {navItems.map((item, idx) => {
                const isActive = item.label === activeTab;
                return (
                    <Link
                        key={idx}
                        to={item.to}
                        className={`flex flex-col items-center justify-center transition-colors active:scale-90 duration-200 ${isActive ? 'text-[#33251d] font-bold' : 'text-[#51625e] opacity-60 hover:opacity-90'}`}
                    >
                        <span className="material-symbols-outlined mb-1" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                            {item.icon}
                        </span>
                        <span className="font-label-sm uppercase tracking-widest">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
