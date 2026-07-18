import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, User, ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const pageTitles = {
  "/seller": "Dashboard",
  "/seller/products": "My Products",
  "/seller/add-product": "Add Product",
  "/seller/bulk-upload": "Bulk Upload",
  "/seller/orders": "Orders",
  "/seller/earnings": "Earnings",
  "/seller/profile": "Store Profile",
};

const SellerNavbar = ({ onMenuClick }) => {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/seller/edit-product") ? "Edit Product" : "Seller");

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
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
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <ArrowLeft size={16} />
            Store
          </Link>

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
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="hidden sm:inline text-sm font-semibold text-gray-800 dark:text-gray-100 max-w-[120px] truncate">
              {user?.name || "Seller"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerNavbar;
