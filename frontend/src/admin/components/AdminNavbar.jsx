import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, User, ArrowLeft, AlertTriangle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { getAnalytics } from "../../api/analyticsApi";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/products": "Products",
  "/admin/add-product": "Add Product",
  "/admin/bulk-upload": "Bulk Upload",
  "/admin/orders": "Manage Orders",
  "/admin/sellers": "Seller Applications",
  "/admin/coupons": "Coupons",
  "/admin/hero-banner": "Hero Banner & Offers",
  "/admin/users": "Users",
  "/admin/admin-management": "Admin Management",
  "/admin/super-admin": "Super Admin Dashboard",
};

const AdminNavbar = ({ onMenuClick }) => {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAnalytics();
        setLowStockCount(data?.lowStock?.length || 0);
      } catch (err) {
        // Non-critical widget — fail silently
        console.log(err);
      }
    })();
  }, []);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/admin/edit-product")
      ? "Edit Product"
      : "Admin");

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger, mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={16} />
            Store
          </Link>

          {lowStockCount > 0 && (
            <button
              onClick={() => navigate("/admin/analytics")}
              className="relative w-10 h-10 rounded-full bg-red-50 dark:bg-red-950 hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-sm"
              aria-label={`${lowStockCount} products low on stock`}
              title={`${lowStockCount} product${lowStockCount > 1 ? "s" : ""} low on stock`}
            >
              <AlertTriangle className="text-red-500" size={18} />
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {lowStockCount}
              </span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-sm"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" size={18} />
            ) : (
              <Moon className="text-gray-700" size={18} />
            )}
          </button>

          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <User size={16} />
              </div>
            )}
            <span className="hidden sm:inline text-sm font-semibold text-gray-800 dark:text-gray-100 max-w-[120px] truncate">
              {user?.name || "Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
