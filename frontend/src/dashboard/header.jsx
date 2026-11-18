import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";

export function Header({ salonName = "spafy" }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const userRole = (user?.role === "owner" ? "salon" : user?.role) || "salon";

  const handleLogout = async () => {
    await logout();
    navigate("/salon/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#d2c4bd]/30 bg-[#fbf9f4] flex justify-between items-center h-16 px-6 md:px-16">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[#33251d] p-2" id="open-sidenav">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-2xl font-serif text-[#33251d] hidden md:block tracking-tight capitalize">
          {salonName} Dashboard
        </h2>
        <h2 className="text-xl font-serif text-[#33251d] md:hidden tracking-tight capitalize">
          {salonName}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4a3b32]/10 text-[#4a3b32]">
              {userRole === "admin" ? "Super Admin" : "Salon Partner"}
            </span>
            <span className="text-xs text-[#4e4540] hidden sm:inline">
              {user.fullName || user.name}
            </span>
          </div>
        )}

        {/* If Admin, quick link back to customer salon view */}
        {userRole === "admin" && (
          <button
            onClick={() => navigate(`/salon/${salonName || "spafy"}`)}
            className="text-[11px] uppercase tracking-wider text-[#4a3b32] hover:text-black border border-[#d2c4bd] px-2.5 py-1 rounded cursor-pointer hidden sm:inline"
            title="Switch to customer salon view"
          >
            Salon View
          </button>
        )}

        <button
          onClick={handleLogout}
          className="text-[11px] uppercase tracking-wider text-[#ba1a1a] hover:bg-[#ba1a1a]/10 border border-[#ba1a1a]/40 px-2.5 py-1 rounded cursor-pointer transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
