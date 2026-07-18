import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import SellerSidebar from "./components/SellerSidebar";
import SellerNavbar from "./components/SellerNavbar";

const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user || user.role !== "seller") {
    return <Navigate to="/become-seller" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <SellerNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
