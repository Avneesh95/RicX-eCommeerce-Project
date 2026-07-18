import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../api/orderApi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  // ================= FETCH =================
const fetchOrders = async () => {
  try {
    console.log("📦 Fetching orders...");

    const res = await getAllOrders();

    console.log("📦 RAW RESPONSE:", res);

    const list =
      res?.orders ||
      res?.data?.orders ||
      res?.data ||
      [];

    setOrders(Array.isArray(list) ? list : []);
  } catch (err) {
    console.error("❌ ORDER FETCH ERROR:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= STATUS UPDATE =================
  const handleStatusChange = async (id, status) => {
    if (!token) {
      alert("Session expired. Please log in again.");
      return;
    }

    try {
      setUpdatingId(id);
      console.log("🔄 Updating order status:", id, status);

      const res = await updateOrderStatus(id, status, token);
      console.log("✅ UPDATED:", res.data);

      // ✅ FIX 2: Correctly update 'status' locally matching backend schema
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id 
            ? { ...o, status, ...(res.data?.order || {}) } 
            : o
        )
      );
    } catch (err) {
      console.error("❌ UPDATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= DELETE ORDER =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete order #${id.slice(-6)}?`
    );
    if (!confirmDelete) return;

    try {
      console.log("🗑 Deleting order:", id);
      await deleteOrder(id, token);

      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("❌ DELETE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete order. Double-check your DELETE /api/order/:id route.");
    }
  };

  // ================= HELPER BADGE STYLES =================
  const getPaymentBadge = (status) => {
    const base = "px-2 py-0.5 rounded text-xs font-semibold uppercase ";
    if (status?.toLowerCase() === "completed" || status?.toLowerCase() === "paid") {
      return base + "bg-green-100 text-green-800";
    }
    return base + "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400 font-medium">
        Loading system orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor transactions, track fulfillment updates, and update order statuses.
        </p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
            No customer orders recorded yet.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-900 border dark:border-gray-800 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:border-gray-700 shadow-sm rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition duration-150"
            >
              {/* LEFT INFO BLOCK */}
              <div className="space-y-1">
                <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  ₹{order.totalAmount}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Payment:</span>
                  <span className={getPaymentBadge(order.paymentStatus)}>
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div>
                  <select
                    // ✅ FIX 1: Read 'status' instead of 'orderStatus'
                    value={order.status || "pending"}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={updatingId === order._id}
                    className="border dark:border-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5 rounded-lg text-sm bg-gray-50 dark:bg-gray-950 font-medium text-gray-700 dark:text-gray-300 transition cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
                  >
                    <option value="pending">⏳ Pending</option>
                    {/* Aligned with backend enum string "confirmed" */}
                    <option value="confirmed">🤝 Confirmed</option>
                    <option value="shipped">📦 Shipped</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>

                <div>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2.5 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}