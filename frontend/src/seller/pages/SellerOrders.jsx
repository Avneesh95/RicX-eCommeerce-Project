import { useEffect, useState } from "react";
import { getMyOrders, updateMyItemStatus } from "../../api/sellerApi";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const statusColor = {
  pending: "bg-gray-200 text-gray-700",
  confirmed: "bg-blue-100 text-blue-700",
  packed: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-yellow-100 text-yellow-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, itemId, status) => {
    try {
      setUpdating(itemId);
      await updateMyItemStatus(orderId, itemId, status);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b dark:border-gray-800">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.customer?.name} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  {order.isPartOfMultiSellerOrder && (
                    <p className="text-xs text-amber-600 mt-1">
                      This order also includes items from other sellers — you
                      only see and manage your own items below.
                    </p>
                  )}
                </div>
                <p className="font-bold text-gray-900 dark:text-white">
                  Your Subtotal: ₹{order.mySubtotal}
                </p>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.image?.url}
                        alt={item.product?.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity} • ₹{item.price} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          statusColor[item.itemStatus] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.itemStatus.replace(/_/g, " ")}
                      </span>

                      <select
                        value={item.itemStatus}
                        disabled={updating === item._id}
                        onChange={(e) =>
                          handleStatusChange(order._id, item._id, e.target.value)
                        }
                        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-2 py-1.5 text-sm"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
