import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Users,
  Home,
  LogOut,
  BarChart3,
  ShoppingBag,
  ShieldCheck,
  TicketPercent,
  Crown,
  Upload,
  X,
  Image as ImageIcon,
  Store,
} from "lucide-react";

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }
  const role = user?.role;

  const isAdmin = role === "admin" || role === "superAdmin";
  const isSuperAdmin = role === "superAdmin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin", show: isAdmin },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/admin/analytics", show: isAdmin },
    { name: "Products", icon: <Package size={20} />, path: "/admin/products", show: isAdmin },
    { name: "Add Product", icon: <PlusCircle size={20} />, path: "/admin/add-product", show: isAdmin },
    { name: "Bulk Upload", icon: <Upload size={20} />, path: "/admin/bulk-upload", show: isAdmin },
    { name: "Manage Orders", icon: <ShoppingBag size={20} />, path: "/admin/orders", show: isAdmin },
    { name: "Sellers", icon: <Store size={20} />, path: "/admin/sellers", show: isAdmin },
    { name: "Coupons", icon: <TicketPercent size={20} />, path: "/admin/coupons", show: isSuperAdmin },
    { name: "Hero Banner", icon: <ImageIcon size={20} />, path: "/admin/hero-banner", show: isSuperAdmin },
    { name: "Users", icon: <Users size={20} />, path: "/admin/users", show: isAdmin },
    // Only Super Admin
    { name: "Admin Management", icon: <ShieldCheck size={20} />, path: "/admin/admin-management", show: isSuperAdmin },
    { name: "Super Admin Dashboard", icon: <Crown size={20} />, path: "/admin/super-admin", show: isSuperAdmin },
  ];

  const navContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-7 border-b border-slate-700 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-500">RicX</h1>
          <p className="text-sm text-slate-400 mt-2">
            {isSuperAdmin ? "Super Admin Panel" : "Admin Dashboard"}
          </p>
        </div>

        {/* Close button, mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-white p-1"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>

      {user && (
        <div className="mx-6 mt-5 bg-slate-800 rounded-xl p-3">
          <p className="font-semibold truncate">{user.name}</p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-blue-600 text-white">
            {role}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems
          .filter((item) => item.show)
          .map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-700 p-4 space-y-3">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <Home size={20} />
          Back to Store
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">© 2026 RicX Store</p>
          <p className="text-[11px] text-slate-600 mt-1">Version 1.0</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: static sidebar, always visible */}
      <aside className="hidden lg:flex w-64 shrink-0 min-h-screen bg-slate-900 text-white flex-col shadow-2xl">
        {navContent}
      </aside>

      {/* Mobile: off-canvas drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer */}
        <aside
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-slate-900 text-white flex flex-col shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {navContent}
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
