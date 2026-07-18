import { Routes, Route } from "react-router-dom";
import SellerLayout from "./SellerLayout";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerAddProduct from "./pages/SellerAddProduct";
import SellerBulkUpload from "./pages/SellerBulkUpload";
import SellerOrders from "./pages/SellerOrders";
import SellerEarnings from "./pages/SellerEarnings";
import SellerProfile from "./pages/SellerProfile";

const SellerRoutes = () => {
  return (
    <Routes>
      <Route element={<SellerLayout />}>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="add-product" element={<SellerAddProduct />} />
        <Route path="bulk-upload" element={<SellerBulkUpload />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="earnings" element={<SellerEarnings />} />
        <Route path="profile" element={<SellerProfile />} />
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
