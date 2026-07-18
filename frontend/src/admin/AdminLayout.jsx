import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminNavbar from "./components/AdminNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // Allow both Admin and Super Admin
  if (!user || (user.role !== "admin" && user.role !== "superAdmin")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      {/* Sidebar (handles its own mobile drawer / desktop static behavior) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
