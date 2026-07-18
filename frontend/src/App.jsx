import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import OTP from "./pages/Otp";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import OrderDetails from "./pages/OrderDetails";
import Wishlist from "./pages/Wishlist";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

// Admin
import AdminRoutes from "./admin/adminRoutes";
import AdminProtectedRoute from "./admin/AdminProtectedRoutes";

// Seller
import SellerRoutes from "./seller/sellerRoutes";
import BecomeSeller from "./pages/BecomeSeller";
import SellerPublicProfile from "./pages/SellerPublicProfile";

// Theme
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* ======================
              USER ROUTES
          ====================== */}

          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/order/:id" element={<OrderDetails />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/success" element={<OrderSuccess />} />

          <Route path="/become-seller" element={<BecomeSeller />} />

          <Route path="/store/:id" element={<SellerPublicProfile />} />

          <Route path="/seller/*" element={<SellerRoutes />} />

          {/* Authentication */}

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route path="/otp" element={<OTP />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ======================
              ADMIN ROUTES
          ====================== */}

          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminRoutes />
              </AdminProtectedRoute>
            }
          />

          {/* ======================
              404 PAGE
          ====================== */}

          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-center">
                  <h1 className="text-7xl font-bold text-red-500">
                    404
                  </h1>

                  <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">
                    Page Not Found
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;