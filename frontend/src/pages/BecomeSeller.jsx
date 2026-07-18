import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, CheckCircle, Clock, XCircle } from "lucide-react";
import { applyForSeller, getMyApplication } from "../api/sellerApi";

const emptyForm = {
  businessName: "",
  description: "",
  contactEmail: "",
  contactPhone: "",
};

export default function BecomeSeller() {
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "seller") {
      navigate("/seller");
      return;
    }
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const { data } = await getMyApplication();
      setApplication(data.application);
      if (data.application) {
        setForm({
          businessName: data.application.businessName || "",
          description: data.application.description || "",
          contactEmail: data.application.contactEmail || "",
          contactPhone: data.application.contactPhone || "",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.businessName) {
      alert("Business name is required");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await applyForSeller(form);
      setApplication(data.application);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-500">
        Loading...
      </div>
    );
  }

  const showForm = !application || application.status === "rejected";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-14 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Store className="text-white" size={30} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Become a RicX Seller
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            List your own products and reach thousands of customers.
          </p>
        </div>

        {application && application.status === "pending" && (
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-800 rounded-2xl p-6 flex items-start gap-4 mb-8">
            <Clock className="text-yellow-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-yellow-800 dark:text-yellow-300">
                Application under review
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                We're reviewing your application for{" "}
                <strong>{application.businessName}</strong>. You'll be able
                to start selling as soon as an admin approves it.
              </p>
            </div>
          </div>
        )}

        {application && application.status === "suspended" && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded-2xl p-6 flex items-start gap-4 mb-8">
            <XCircle className="text-red-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-red-800 dark:text-red-300">
                Seller account suspended
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Your seller account has been suspended. Please contact
                support for details.
              </p>
            </div>
          </div>
        )}

        {application && application.status === "rejected" && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded-2xl p-6 flex items-start gap-4 mb-8">
            <XCircle className="text-red-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-red-800 dark:text-red-300">
                Application rejected
              </h3>
              {application.rejectionReason && (
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  Reason: {application.rejectionReason}
                </p>
              )}
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                You can update your details and re-apply below.
              </p>
            </div>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-4"
          >
            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Business Name *
              </label>
              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
              />
            </div>

            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Contact Email
                </label>
                <input
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Contact Phone
                </label>
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}

        {application && application.status === "approved" && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-300 dark:border-green-800 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle className="text-green-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-green-800 dark:text-green-300">
                You're an approved seller!
              </h3>
              <button
                onClick={() => navigate("/seller")}
                className="mt-3 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Go to Seller Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
