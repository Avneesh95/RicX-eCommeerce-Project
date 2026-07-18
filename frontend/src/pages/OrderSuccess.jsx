import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, PackageCheck, Wallet } from "lucide-react";

export default function OrderSuccess() {
  const location = useLocation();
  const isCOD = location.state?.paymentMethod === "cod";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-10 text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="text-green-600 dark:text-green-400" size={44} />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
          {isCOD ? "Order Placed!" : "Payment Successful"}
        </h1>

        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {isCOD
            ? "Your order is confirmed — pay in cash when it arrives."
            : "Your order has been placed successfully."}
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {isCOD ? <Wallet size={16} /> : <PackageCheck size={16} />}
          {isCOD ? "Cash on Delivery" : "Paid via Razorpay"}
        </div>

        <Link
          to="/orders"
          className="mt-8 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          View My Orders
        </Link>
      </motion.div>
    </div>
  );
}
