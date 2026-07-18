import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";
import api from "../../api/axios";

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    admins: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/super-admin/dashboard");

      setStats({
        products: data.products || 0,
        users: data.users || 0,
        admins: data.admins || 0,
        orders: data.orders || 0,
        revenue: data.revenue || 0,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Dashboard Error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center font-semibold text-gray-500 dark:text-gray-400">
        Loading platform statistics...
      </div>
    );
  }

  const cards = [
    {
      title: "Products",
      value: stats.products,
      icon: <Package size={35} />,
      color: "bg-blue-600",
    },
    {
      title: "Customers",
      value: stats.users,
      icon: <Users size={35} />,
      color: "bg-green-600",
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: <ShieldCheck size={35} />,
      color: "bg-red-600",
    },
    {
      title: "Orders",
      value: stats.orders,
      icon: <ShoppingBag size={35} />,
      color: "bg-purple-600",
    },
    {
      title: "Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: <IndianRupee size={35} />,
      color: "bg-orange-600",
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-0">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white p-8 shadow-xl">
        <h1 className="text-4xl font-bold flex items-center gap-2 text-white">
          👑 Super Admin Dashboard
        </h1>
        <p className="mt-2 text-lg opacity-90">
          Complete control over the RicX platform.
        </p>
      </div>

      {/* Grid Stats Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform duration-300"
          >
            <div
              className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 shadow-md`}
            >
              {card.icon}
            </div>

            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
              {card.title}
            </h2>

            <p className="text-3xl font-black mt-2 text-gray-900 dark:text-white tracking-tight">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;