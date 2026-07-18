import { useEffect, useState } from "react";
import { getMyApplication, updateMySellerProfile } from "../../api/sellerApi";

export default function SellerProfile() {
  const [form, setForm] = useState({
    businessName: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyApplication();
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
    })();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateMySellerProfile(form);
      alert("Profile updated");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Store Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-4"
      >
        <div>
          <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Business Name
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
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
