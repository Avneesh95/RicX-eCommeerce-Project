import { useEffect, useState } from "react";
import {
  getCoupons,
  toggleCoupon,
  deleteCoupon,
  setHeroCoupon,
  createCoupon, // 1. Added the create import
} from "../../api/couponApi";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  
  // Form input states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const loadCoupons = async () => {
    try {
      const res = await getCoupons();
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // Handle Form Submission
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await createCoupon({
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        expiryDate,
      });

      alert("Coupon Created Successfully 🎉");
      
      // Reset form states
      setCode("");
      setDiscountValue("");
      setExpiryDate("");
      setShowModal(false);
      
      // Refresh list
      loadCoupons();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create coupon");
    }
  };

  const heroCoupon = async (id) => {
    try {
      await setHeroCoupon(id);
      alert("Hero Coupon Updated");
      loadCoupons();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const enableDisable = async (id) => {
    await toggleCoupon(id);
    loadCoupons();
  };

  const removeCoupon = async (id) => {
    if (!window.confirm("Delete Coupon?")) return;
    await deleteCoupon(id);
    loadCoupons();
  };

  return (
    <div className="p-8">
      {/* Header Section with Action Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coupon Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow dynamic-transition"
        >
          + Add New Coupon
        </button>
      </div>

      {/* ========================================================
         ADD NEW COUPON MODAL
         ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Create New Coupon</h2>
            
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., SUMMER50"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border dark:border-gray-800 border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full border dark:border-gray-800 border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Value"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full border dark:border-gray-800 border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full border dark:border-gray-800 border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
         COUPON MANAGEMENT LIST TABLE
         ======================================================== */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full bg-white dark:bg-gray-900">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Code</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Hero</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No coupons found. Click "+ Add New Coupon" to create one!
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b text-center hover:bg-gray-50 dark:bg-gray-950">
                  <td className="p-4 font-bold tracking-wider text-gray-800 dark:text-gray-100">
                    {coupon.code}
                  </td>
                  <td>
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </td>
                  <td>
                    {coupon.isActive ? (
                      <span className="bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 font-semibold px-2.5 py-1 rounded-full text-xs">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td>
                    {coupon.showOnHero ? (
                      <span className="text-yellow-600 font-bold text-sm bg-yellow-50 px-2.5 py-1 rounded-full border dark:border-gray-800 border-yellow-200">
                        ⭐ Hero Banner
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="space-x-2 p-4">
                    <button
                      onClick={() => heroCoupon(coupon._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow-sm font-medium text-sm transition-colors"
                    >
                      Hero
                    </button>
                    <button
                      onClick={() => enableDisable(coupon._id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded shadow-sm font-medium text-sm transition-colors"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => removeCoupon(coupon._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow-sm font-medium text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupons;