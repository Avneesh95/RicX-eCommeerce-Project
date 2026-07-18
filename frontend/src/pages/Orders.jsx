import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Eye,
  XCircle,
  Download,
  CreditCard,
  Wallet,
  Loader2,
} from "lucide-react";

import {
  getMyOrders,
  cancelOrder,
  downloadInvoice,
} from "../api/orderApi";

import OrderTimeline from "../components/OrderTimeline";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    const ok = window.confirm("Are you sure you want to cancel this order?");
    if (!ok) return;

    try {
      setCancellingId(id);
      await cancelOrder(id);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      setDownloadingId(id);
      const res = await downloadInvoice(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `RicX-Invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice");
    } finally {
      setDownloadingId(null);
    }
  };

  // Cancellable regardless of payment method, as long as it hasn't
  // shipped/delivered/already been cancelled.
  const canCancel = (order) =>
    !["cancelled", "shipped", "delivered"].includes(order.status);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col justify-center items-center gap-3 text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin" size={32} />
        <span className="text-lg font-semibold">Loading Orders...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Package size={70} className="mx-auto text-gray-400" />

          <h2 className="text-3xl font-bold mt-5 text-gray-900 dark:text-white">
            No Orders Yet
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Looks like you haven't placed any orders.
          </p>

          <Link
            to="/"
            className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl transition"
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence>
            {orders.map((order, index) => {
              const isCOD = order.paymentMethod === "COD";

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border dark:border-gray-800 p-6 hover:shadow-xl transition-all"
                >
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                      <p className="font-semibold text-gray-900 dark:text-white break-all">
                        {order._id}
                      </p>
                      <p className="mt-3 text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>

                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {isCOD ? <Wallet size={13} /> : <CreditCard size={13} />}
                        {isCOD ? "Cash on Delivery" : "Paid Online"}
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Total Amount</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <div className="lg:text-right">
                      <span
                        className={`px-4 py-2 rounded-full text-white font-semibold ${
                          order.status === "delivered"
                            ? "bg-green-600"
                            : order.status === "cancelled"
                              ? "bg-red-600"
                              : order.status === "shipped"
                                ? "bg-blue-600"
                                : order.status === "confirmed"
                                  ? "bg-indigo-600"
                                  : "bg-yellow-500"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>

                      <p className="mt-3 text-gray-700 dark:text-gray-300">
                        Payment:
                        <span
                          className={`ml-2 font-semibold ${
                            order.paymentStatus === "paid"
                              ? "text-green-600 dark:text-green-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {isCOD && order.paymentStatus === "pending"
                            ? "DUE ON DELIVERY"
                            : order.paymentStatus.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="mt-8">
                    <OrderTimeline status={order.status} />
                  </div>

                  {/* Products */}
                  <div className="mt-8">
                    <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">
                      Products ({order.orderItems?.length || 0})
                    </h2>

                    <div className="space-y-4">
                      {order.orderItems?.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col md:flex-row md:items-center gap-5 border dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition"
                        >
                          <img
                            src={item.product?.image?.url}
                            alt={item.product?.name}
                            className="w-24 h-24 rounded-xl object-cover border dark:border-gray-800"
                          />

                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {item.product?.name}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                            <p className="font-bold text-green-600 dark:text-green-400 mt-1">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      to={`/order/${order._id}`}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition"
                    >
                      <Eye size={18} />
                      View Details
                    </Link>

                    <button
                      onClick={() => handleDownloadInvoice(order._id)}
                      disabled={downloadingId === order._id}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition disabled:opacity-60"
                    >
                      {downloadingId === order._id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Download size={18} />
                      )}
                      Download Invoice
                    </button>

                    {canCancel(order) && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl transition disabled:opacity-60"
                      >
                        {cancellingId === order._id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                        Cancel Order
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Orders;
