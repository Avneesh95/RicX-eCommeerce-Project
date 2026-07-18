import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Wallet,
  Store,
  Home,
  LogOut,
  Upload,
  X,
} from "lucide-react";

const SellerSidebar = ({ isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/seller", end: true },
    { name: "My Products", icon: <Package size={20} />, path: "/seller/products" },
    { name: "Add Product", icon: <PlusCircle size={20} />, path: "/seller/add-product" },
    { name: "Bulk Upload", icon: <Upload size={20} />, path: "/seller/bulk-upload" },
    { name: "Orders", icon: <ShoppingBag size={20} />, path: "/seller/orders" },
    { name: "Earnings", icon: <Wallet size={20} />, path: "/seller/earnings" },
    { name: "Store Profile", icon: <Store size={20} />, path: "/seller/profile" },
  ];

  const navContent = (
    <>
      <div className="px-6 py-7 border-b border-slate-700 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-emerald-500">RicX</h1>
          <p className="text-sm text-slate-400 mt-2">Seller Dashboard</p>
        </div>
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
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

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
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 min-h-screen bg-slate-900 text-white flex-col shadow-2xl">
        {navContent}
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
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

export default SellerSidebar;
