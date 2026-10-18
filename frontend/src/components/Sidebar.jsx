import { NavLink } from "react-router-dom";
import {
  CreditCard,
  LayoutDashboard,
  CalendarClock,
  Receipt,
  Target,
  User,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const sidebarLinks = [
  {
    title: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Cards",
    to: "/cards",
    icon: CreditCard,
  },
  {
    title: "Upcoming Dues",
    to: "/dues",
    icon: CalendarClock,
  },
  {
    title: "Transactions",
    to: "/transactions",
    icon: Receipt,
  },
  {
    title: "Category Limits",
    to: "/categories",
    icon: Target,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: User,
  },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#111827] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <CreditCard className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <p className="text-base font-bold">Card Wise</p>
              <p className="text-xs text-white/60">
                Smart card management
              </p>
            </div>
          </div>

          {/* Close button - mobile only */}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.title}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {link.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;