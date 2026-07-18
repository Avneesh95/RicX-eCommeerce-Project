import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Clock, Percent } from "lucide-react";
import { getMyEarnings } from "../../api/sellerApi";

export default function SellerEarnings() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyEarnings();
        setEarnings(data.earnings);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
  }

  const cards = [
    {
      label: "Gross Sales",
      value: `₹${(earnings?.grossSales || 0).toFixed(0)}`,
      icon: <TrendingUp size={20} />,
    },
    {
      label: "Delivered Sales",
      value: `₹${(earnings?.deliveredSales || 0).toFixed(0)}`,
      icon: <Wallet size={20} />,
    },
    {
      label: "Pending Sales",
      value: `₹${(earnings?.pendingSales || 0).toFixed(0)}`,
      icon: <Clock size={20} />,
    },
    {
      label: "Platform Commission",
      value: `${earnings?.commissionRate || 0}%`,
      icon: <Percent size={20} />,
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5"
          >
            <div className="text-emerald-600 mb-2">{c.icon}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
        <p className="text-sm text-emerald-800 dark:text-emerald-300">
          Net earnings after commission
        </p>
        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
          ₹{(earnings?.netEarnings || 0).toFixed(0)}
        </p>
        <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-2">
          This is a running ledger based on your paid orders — actual payout
          transfers happen outside the platform for now.
        </p>
      </div>
    </div>
  );
}
