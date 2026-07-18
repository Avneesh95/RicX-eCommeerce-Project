import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Ban, RotateCcw } from "lucide-react";
import {
  getAllSellerApplications,
  approveSellerApplication,
  rejectSellerApplication,
  setSellerSuspension,
} from "../api/sellerApi";

const TABS = ["pending", "approved", "rejected", "suspended"];

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-gray-200 text-gray-700",
};

export default function SellerApprovals() {
  const [tab, setTab] = useState("pending");
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const { data } = await getAllSellerApplications(tab);
      setSellers(data.sellers || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [tab]);

  const handleApprove = async (id) => {
    try {
      await approveSellerApplication(id);
      fetchSellers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):") || "";
    try {
      await rejectSellerApplication(id, reason);
      fetchSellers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject");
    }
  };

  const handleSuspend = async (id, suspend) => {
    try {
      await setSellerSuspension(id, suspend);
      fetchSellers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update seller");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Seller Applications
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Review, approve, and manage marketplace sellers.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition ${
              tab === t
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : sellers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No {tab} sellers.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((s) => (
            <div
              key={s._id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                  {s.businessName}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[s.status]}`}
                >
                  {s.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {s.user?.name} • {s.user?.email}
              </p>

              {s.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {s.description}
                </p>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-400">
                {s.contactEmail} {s.contactPhone && `• ${s.contactPhone}`}
              </div>

              <div className="flex gap-2 pt-2">
                {s.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(s._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(s._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}

                {s.status === "approved" && (
                  <button
                    onClick={() => handleSuspend(s._id, true)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-semibold"
                  >
                    <Ban size={16} /> Suspend
                  </button>
                )}

                {s.status === "suspended" && (
                  <button
                    onClick={() => handleSuspend(s._id, false)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
                  >
                    <RotateCcw size={16} /> Reinstate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
