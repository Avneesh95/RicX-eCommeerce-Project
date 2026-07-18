import { Routes, Route } from "react-router-dom";

import Analytics from "../pages/Analytics";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

import Coupons from "./pages/Coupons";

import AdminLayout from "./AdminLayout";
import AdminManagement from "../../src/admin/Admin-management";
// Admin Pages
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProducts";

import AdminUsers from "../pages/AdminUser";
import AdminOrders from "../pages/AdminOrder";
import AdminBulkUpload from "../pages/AdminBulkUpload";
import AdminOffers from "./AdminOffers";
import SellerApprovals from "./SellerApprovals";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Products */}
        <Route path="products" element={<Products />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} />

        {/* Orders */}
        <Route path="orders" element={<AdminOrders />} />

        {/* Bulk Upload / Coupons (Replace later if needed) */}
        <Route path="bulk-upload" element={<AdminBulkUpload />} />

        {/* {Coupons} */}
        <Route path="coupons" element={<Coupons />} />
        {/* Analytics */}
        <Route path="analytics" element={<Analytics />} />

        <Route path="admin-management" element={<AdminManagement />} />
        {/* Users */}
        <Route path="users" element={<AdminUsers />} />

        {/* Super Admin Dashboard */}
        <Route path="super-admin" element={<SuperAdminDashboard />} />

        {/* Hero Banner / Offers (Super Admin only) */}
        <Route path="hero-banner" element={<AdminOffers />} />

        {/* Seller Applications (Admin + Super Admin) */}
        <Route path="sellers" element={<SellerApprovals />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
