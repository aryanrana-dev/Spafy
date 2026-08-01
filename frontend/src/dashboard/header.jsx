export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d2c4bd]/30 bg-[#fbf9f4] flex justify-between items-center h-16 px-6 md:px-16">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[#33251d] p-2" id="open-sidenav">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-2xl font-serif text-[#33251d] hidden md:block tracking-tight">Salon Management</h2>
        <h2 className="text-xl font-serif text-[#33251d] md:hidden tracking-tight">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-[#4e4540] hover:text-[#51625e] p-2 relative transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>
        <button className="text-[#4e4540] hover:text-[#51625e] p-2 transition-colors">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  )
};