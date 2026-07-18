import { useEffect, useState } from "react";
import { getAnalytics } from "../api/analyticsApi";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  IndianRupee,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
} from "lucide-react";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const monthNames = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Analytics() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await getAnalytics();

      const data = res.data;

      
      setStats(data.stats);

      setMonthlyRevenue(
        data.monthlyRevenue.map((item) => ({
          month: monthNames[item._id.month],
          revenue: item.revenue,
        })),
      );

      setMonthlyOrders(
        data.monthlyOrders.map((item) => ({
          month: monthNames[item._id.month],
          orders: item.orders,
        })),
      );

      setCategoryStats(
        data.categoryStats.map((item) => ({
          name: item._id,
          value: item.value,
        })),
      );


      setLowStock(data.lowStock);


      
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl font-semibold text-gray-700 dark:text-gray-300">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Business insights and performance overview
        </p>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
          <IndianRupee className="text-green-600 mb-3" size={30} />
          <h2 className="text-gray-500 dark:text-gray-400">Revenue</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
          <ShoppingBag className="text-blue-600 mb-3" size={30} />
          <h2 className="text-gray-500 dark:text-gray-400">Orders</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
          <Users className="text-purple-600 mb-3" size={30} />
          <h2 className="text-gray-500 dark:text-gray-400">Users</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
          <Package className="text-orange-600 mb-3" size={30} />
          <h2 className="text-gray-500 dark:text-gray-400">Products</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">Monthly Revenue</h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">Monthly Orders</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar dataKey="orders" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Category & Low Stock */}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Category Distribution */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">Products by Category</h2>

          {categoryStats.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-gray-400 dark:text-gray-600">
              No category data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Low Stock */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="text-red-500" size={24} />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Low Stock Products</h2>
          </div>

          {lowStock.length === 0 ? (
            <div className="text-green-600 font-semibold">
              🎉 All products have sufficient stock.
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-gray-700 dark:text-gray-300">Product</th>

                    <th className="text-left text-gray-700 dark:text-gray-300">Category</th>

                    <th className="text-left text-gray-700 dark:text-gray-300">Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {lowStock.map((item) => (
                    <tr key={item._id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 font-medium text-gray-900 dark:text-white">{item.name}</td>

                      <td className="text-gray-600 dark:text-gray-400">{item.category}</td>

                      <td>
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 font-semibold">
                          {item.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold text-white">RicX Store Analytics</h2>

        <p className="mt-2 text-blue-100">
          Monitor your business performance, identify inventory shortages, track
          monthly revenue, and make smarter decisions using real-time insights.
        </p>
      </div>
    </div>
  );
}
