import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, Wallet, TrendingUp } from "lucide-react";
import { getMyEarnings, getMyOrders } from "../../api/sellerApi";

export default function SellerDashboard() {
  const [earnings, setEarnings] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  useEffect(() => {
    (async () => {
      try {
        const [earningsRes, ordersRes] = await Promise.all([
          getMyEarnings(),
          getMyOrders(),
        ]);
        setEarnings(earningsRes.data.earnings);
        setOrderCount(ordersRes.data.orders?.length || 0);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    {
      label: "Net Earnings",
      value: `₹${(earnings?.netEarnings || 0).toFixed(0)}`,
      icon: <Wallet size={22} />,
      color: "bg-emerald-600",
    },
    {
      label: "Gross Sales",
      value: `₹${(earnings?.grossSales || 0).toFixed(0)}`,
      icon: <TrendingUp size={22} />,
      color: "bg-indigo-600",
    },
    {
      label: "Orders",
      value: orderCount,
      icon: <ShoppingBag size={22} />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here's how your store is doing.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.label}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${c.color} text-white flex items-center justify-center`}>
                {c.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {earnings?.commissionRate != null && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Platform commission: {earnings.commissionRate}% • Pending payout:{" "}
          ₹{(earnings.pendingSales || 0).toFixed(0)}
        </p>
      )}

      <div className="flex gap-4 flex-wrap">
        <Link
          to="/seller/add-product"
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg flex items-center gap-2"
        >
          <Package size={18} /> Add a Product
        </Link>
        <Link
          to="/seller/orders"
          className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold flex items-center gap-2"
        >
          <ShoppingBag size={18} /> View Orders
        </Link>
      </div>
    </div>
  );
}
