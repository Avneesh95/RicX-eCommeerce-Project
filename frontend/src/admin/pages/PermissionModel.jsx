import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";

export default function PermissionModal({
  open,
  admin,
  onClose,
  onSave,
}) {
  const defaultPermissions = {
    products: false,
    orders: false,
    users: false,
    coupons: false,
    reviews: false,
    dashboard: false,
    analytics: false,
  };

  const [permissions, setPermissions] = useState(defaultPermissions);

  useEffect(() => {
    if (admin?.permissions) {
      setPermissions({
        ...defaultPermissions,
        ...admin.permissions,
      });
    } else {
      setPermissions(defaultPermissions);
    }
  }, [admin]);

  const togglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const permissionList = [
    { key: "products", label: "Manage Products" },
    { key: "orders", label: "Manage Orders" },
    { key: "users", label: "Manage Users" },
    { key: "coupons", label: "Manage Coupons" },
    { key: "reviews", label: "Manage Reviews" },
    { key: "dashboard", label: "Dashboard Access" },
    { key: "analytics", label: "Analytics Access" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 shadow-2xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Permissions
                </h2>
              </div>

              <button onClick={onClose}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              {permissionList.map((item) => (
                <label
                  key={item.key}
                  className="flex justify-between items-center border dark:border-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:bg-gray-950"
                >
                  <span className="font-medium">
                    {item.label}
                  </span>

                  <input
                    type="checkbox"
                    checked={permissions[item.key]}
                    onChange={() => togglePermission(item.key)}
                    className="h-5 w-5"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl border dark:border-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  onSave(admin._id, permissions)
                }
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save Permissions
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}