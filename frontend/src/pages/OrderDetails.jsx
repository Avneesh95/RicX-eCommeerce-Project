import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  CreditCard,
  Wallet,
  ArrowLeft,
  XCircle,
  Loader2,
  User,
  Phone,
} from "lucide-react";

import OrderTimeline from "../components/OrderTimeline";
import { getOrderById, cancelOrder } from "../api/orderApi";

const statusBg = {
  delivered: "bg-green-600",
  cancelled: "bg-red-600",
  shipped: "bg-blue-600",
  confirmed: "bg-indigo-600",
  pending: "bg-yellow-500",
};

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id);
      setOrder(res.data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    const ok = window.confirm("Are you sure you want to cancel this order?");
    if (!ok) return;

    try {
      setCancelling(true);
      await cancelOrder(order._id);
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col justify-center items-center gap-3 text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin" size={32} />
        <span className="text-lg font-semibold">Loading order...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-[70vh] flex justify-center items-center text-gray-500 dark:text-gray-400">
        Order not found
      </div>
    );
  }

  const isCOD = order.paymentMethod === "COD";
  const canCancel = !["cancelled", "shipped", "delivered"].includes(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-6xl mx-auto p-6 sm:p-8"
    >
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-8 font-medium"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Order Details
      </h1>

      {/* Order Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Order ID</h2>
            <p className="text-gray-500 dark:text-gray-400 break-all">{order._id}</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Status</h2>
            <span
              className={`inline-block mt-1 px-4 py-2 rounded-full text-white capitalize ${
                statusBg[order.status] || "bg-gray-500"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Payment</h2>
            <span
              className={`inline-flex items-center gap-1.5 mt-1 px-4 py-2 rounded-full text-white ${
                order.paymentStatus === "paid" ? "bg-green-600" : "bg-yellow-500"
              }`}
            >
              {isCOD ? <Wallet size={14} /> : <CreditCard size={14} />}
              {isCOD && order.paymentStatus === "pending"
                ? "Due on Delivery"
                : order.paymentStatus}
            </span>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Total</h2>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
        <OrderTimeline status={order.status} />
      </div>

      {/* Shipping */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <MapPin className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
        </div>

        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <strong className="text-gray-900 dark:text-white">
              {order.shippingAddress.fullName}
            </strong>
          </p>
          <p className="flex items-center gap-2">
            <Phone size={16} className="text-gray-400" />
            {order.shippingAddress.phone}
          </p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </p>
          <p>
            {order.shippingAddress.country} - {order.shippingAddress.pincode}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Package className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ordered Products</h2>
        </div>

        <div className="space-y-5">
          {order.orderItems.map((item) => (
            <div
              key={item._id}
              className="border dark:border-gray-800 rounded-xl p-4 flex gap-5 items-center hover:shadow-md transition"
            >
              <img
                src={item.product?.image?.url}
                alt={item.product?.name}
                className="w-24 h-24 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {item.product?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Quantity: {item.quantity}
                </p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  ₹{item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          {isCOD ? (
            <Wallet className="text-indigo-600 dark:text-indigo-400" />
          ) : (
            <CreditCard className="text-indigo-600 dark:text-indigo-400" />
          )}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment Information
          </h2>
        </div>

        <div className="text-gray-700 dark:text-gray-300 space-y-1">
          <p>
            <strong className="text-gray-900 dark:text-white">Method:</strong>{" "}
            {isCOD ? "Cash on Delivery" : "Razorpay (Online)"}
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Status:</strong>{" "}
            {isCOD && order.paymentStatus === "pending"
              ? "Due on delivery"
              : order.paymentStatus}
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Total:</strong> ₹
            {order.totalAmount}
          </p>
        </div>
      </div>

      {/* Actions */}
      {canCancel && (
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-60"
          >
            {cancelling ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <XCircle size={20} />
            )}
            Cancel Order
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default OrderDetails;
