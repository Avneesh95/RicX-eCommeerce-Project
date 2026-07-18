import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Image as ImageIcon, Trash2, CheckCircle, Circle } from "lucide-react";
import {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "../api/offerApi";

const emptyForm = {
  title: "",
  description: "",
  discount: "",
  offerType: "festival",
  startDate: "",
  endDate: "",
  redirectUrl: "",
  isActive: false,
};

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOffers();
      setOffers(data.offers || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleBanner = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setBanner(null);
    setPreview("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title) {
      alert("Title is required");
      return;
    }

    if (!editingId && !banner) {
      alert("Please upload a banner image for the Hero section");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("discount", form.discount || 0);
      formData.append("offerType", form.offerType);
      if (form.startDate) formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      formData.append("redirectUrl", form.redirectUrl);
      formData.append("isActive", form.isActive);
      if (banner) formData.append("banner", banner);

      if (editingId) {
        await updateOffer(editingId, formData);
      } else {
        await createOffer(formData);
      }

      resetForm();
      fetchOffers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setForm({
      title: offer.title || "",
      description: offer.description || "",
      discount: offer.discount || "",
      offerType: offer.offerType || "festival",
      startDate: offer.startDate ? offer.startDate.slice(0, 10) : "",
      endDate: offer.endDate ? offer.endDate.slice(0, 10) : "",
      redirectUrl: offer.redirectUrl || "",
      isActive: offer.isActive || false,
    });
    setPreview(offer.banner || "");
    setBanner(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActivate = async (offer) => {
    try {
      const formData = new FormData();
      formData.append("isActive", true);
      await updateOffer(offer._id, formData);
      fetchOffers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to activate banner");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner permanently?")) return;
    try {
      await deleteOffer(id);
      fetchOffers();
      if (editingId === id) resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete banner");
    }
  };

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (user?.role !== "superAdmin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Hero Banner & Offers
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Control the poster image shown on the storefront Hero section. Only
          one banner can be active at a time.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 grid md:grid-cols-2 gap-6"
      >
        {/* Left: Image */}
        <div>
          <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Banner Image
          </label>

          <label
            htmlFor="banner-upload"
            className="mt-2 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl h-64 cursor-pointer overflow-hidden bg-gray-50 dark:bg-gray-950"
          >
            {preview ? (
              <img
                src={preview}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <ImageIcon className="text-gray-400" size={36} />
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Click to upload banner
                </span>
              </>
            )}
          </label>
          <input
            id="banner-upload"
            type="file"
            accept="image/*"
            onChange={handleBanner}
            className="hidden"
          />
        </div>

        {/* Right: Fields */}
        <div className="space-y-4">
          <div>
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Big Diwali Sale"
              className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
            />
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Description
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short tagline shown with the banner"
              className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Discount %
              </label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
              />
            </div>

            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                name="offerType"
                value={form.offerType}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
              >
                <option value="festival">Festival</option>
                <option value="seasonal">Seasonal</option>
                <option value="flash">Flash</option>
                <option value="bank">Bank Offer</option>
                <option value="special">Special</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Redirect URL (optional)
            </label>
            <input
              name="redirectUrl"
              value={form.redirectUrl}
              onChange={handleChange}
              placeholder="/products?category=Electronics"
              className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            Make this the live Hero banner
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Banner"
                  : "Create Banner"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 dark:text-white font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Existing Offers */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          All Banners
        </h2>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : offers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No banners created yet — the storefront will show a default
            poster until you add one.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className={`bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden border-2 ${
                  offer.isActive
                    ? "border-green-500"
                    : "border-transparent"
                }`}
              >
                <div className="h-36 bg-gray-100 dark:bg-gray-800">
                  {offer.banner ? (
                    <img
                      src={offer.banner}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                      {offer.title}
                    </h3>
                    {offer.isActive ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                        <CheckCircle size={14} /> Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Circle size={14} /> Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {offer.description || "—"}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      Edit
                    </button>

                    {!offer.isActive && (
                      <button
                        onClick={() => handleActivate(offer)}
                        className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                      >
                        Set Live
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                      aria-label="Delete banner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
