export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 bg-[#fbf9f4] md:hidden rounded-t-xl border-t border-[#d2c4bd]/20">
            {[
                { icon: 'home_max', label: 'HOME', active: false },
                { icon: 'spa', label: 'SERVICES', active: true },
                { icon: 'calendar_month', label: 'BOOKINGS', active: false },
                { icon: 'person', label: 'PROFILE', active: false },
            ].map((item, idx) => (
                <a
                    key={idx}
                    href="#"
                    className={`flex flex-col items-center justify-center transition-colors active:scale-90 duration-200 ${item.active ? 'text-[#33251d] font-bold' : 'text-[#51625e] opacity-60'}`}
                >
                    <span className="material-symbols-outlined mb-1" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {item.icon}
                    </span>
                    <span className="font-label-sm uppercase tracking-widest">{item.label}</span>
                </a>
            ))}
        </nav>
    )
}