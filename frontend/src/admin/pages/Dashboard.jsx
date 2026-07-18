import { useEffect, useState } from "react";
import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  PlusCircle,
  BarChart3,
  Upload,
  Store,
  Image as ImageIcon,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../../api/axios";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = user?.role === "superAdmin";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const endpoint = isSuperAdmin
        ? "/super-admin/dashboard"
        : "/admin/dashboard";

      const res = await api.get(endpoint);

      setStats({
        products: res.data.products || res.data.stats?.products || 0,
        users: res.data.users || res.data.stats?.users || 0,
        orders: res.data.orders || res.data.stats?.orders || 0,
        revenue: res.data.revenue || res.data.stats?.revenue || 0,
      });

      setRecentOrders(res.data.recentOrders || res.data.stats?.recentOrders || []);
      setLatestUsers(res.data.latestUsers || res.data.stats?.latestUsers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <div className="text-xl font-semibold text-gray-500 dark:text-gray-400">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  const statsData = [
    { title: "Products", value: stats.products, icon: <Package size={28} />, color: "bg-blue-600" },
    { title: "Users", value: stats.users, icon: <Users size={28} />, color: "bg-purple-600" },
    { title: "Orders", value: stats.orders, icon: <ShoppingBag size={28} />, color: "bg-orange-500" },
    { title: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: <IndianRupee size={28} />, color: "bg-green-600" },
  ];

  const actions = [
    { title: "Manage Products", icon: <Package size={30} />, link: "/admin/products", color: "bg-blue-600" },
    { title: "Add Product", icon: <PlusCircle size={30} />, link: "/admin/add-product", color: "bg-green-600" },
    { title: "Bulk Upload", icon: <Upload size={30} />, link: "/admin/bulk-upload", color: "bg-indigo-600" },
    { title: "Manage Orders", icon: <ShoppingBag size={30} />, link: "/admin/orders", color: "bg-orange-500" },
    { title: "Manage Users", icon: <Users size={30} />, link: "/admin/users", color: "bg-purple-600" },
    { title: "Analytics", icon: <BarChart3 size={30} />, link: "/admin/analytics", color: "bg-pink-600" },

    ...(isSuperAdmin
      ? [
          { title: "Sellers", icon: <Store size={30} />, link: "/admin/sellers", color: "bg-teal-600" },
          { title: "Hero Banner", icon: <ImageIcon size={30} />, link: "/admin/hero-banner", color: "bg-rose-600" },
          { title: "Manage Admins", icon: <Users size={30} />, link: "/admin/users", color: "bg-red-600" },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold text-white">
          {isSuperAdmin ? "Welcome Super Admin 👑" : "Welcome Back 👋"}
        </h1>

        <p className="mt-3 text-blue-100 text-lg">
          {isSuperAdmin
            ? "You have complete platform control."
            : "Manage your products, users and orders."}
        </p>
      </div>

      {isSuperAdmin && (
        <div className="bg-gradient-to-r from-red-600 to-purple-700 text-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white">👑 Super Admin Access</h2>
          <p className="mt-2 opacity-90">
            You have full control over the platform including sellers, admin
            management, user permissions, coupons, hero banners, and analytics.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsData.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Quick Actions</h2>
          <span className="text-gray-500 dark:text-gray-400">Everything at one place</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6"
            >
              <div
                className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition`}
              >
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Click to manage</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center border dark:border-gray-800 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.shippingAddress?.fullName}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-green-600 dark:text-green-400">
                      ₹{order.totalAmount}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                          : order.status === "confirmed"
                            ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                            : order.status === "cancelled"
                              ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                              : "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 dark:text-gray-600">
              No recent orders found.
            </div>
          )}
        </div>

        {/* Latest Users */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Latest Users</h2>
            <Link
              to="/admin/users"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View All →
            </Link>
          </div>

          {latestUsers.length > 0 ? (
            <div className="space-y-4">
              {latestUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex justify-between items-center border dark:border-gray-800 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{u.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "superAdmin"
                        ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                        : u.role === "admin"
                          ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400"
                          : u.role === "seller"
                            ? "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {u.role === "superAdmin"
                      ? "👑 Super Admin"
                      : u.role === "admin"
                        ? "🛡️ Admin"
                        : u.role === "seller"
                          ? "🏪 Seller"
                          : "Customer"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 dark:text-gray-600">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
