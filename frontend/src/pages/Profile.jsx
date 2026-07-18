import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Camera,
  MapPin,
  Plus,
  Trash2,
  Star,
  Loader2,
  Save,
} from "lucide-react";
import { getProfile, updateProfile } from "../api/authApi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const u = res.data.user;

      setUser(u);
      setName(u.name || "");
      setPhone(u.phone || "");
      setGender(u.gender || "");
      setDob(
        u.dateOfBirth && typeof u.dateOfBirth === "string"
          ? u.dateOfBirth.substring(0, 10)
          : ""
      );
      setAddresses(u.addresses || []);
      setPreview(u.avatar?.url || "");
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("gender", gender);
      formData.append("dateOfBirth", dob);
      formData.append("addresses", JSON.stringify(addresses));
      if (avatar) formData.append("avatar", avatar);

      const res = await updateProfile(formData);
      alert(res.data.message || "Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      return alert("Please fill all address fields");
    }

    let updated = [...addresses];
    if (newAddress.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }
    updated.push(newAddress);
    setAddresses(updated);

    setNewAddress({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3 text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin" size={32} />
        <span className="text-lg font-semibold">Loading profile...</span>
      </div>
    );
  }

  const inputClass =
    "w-full mt-2 border dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-indigo-500 outline-none transition";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 sm:p-10"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          My Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={preview || `https://ui-avatars.com/api/?name=${name}`}
                alt="avatar"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
              />
              <label
                htmlFor="avatarInput"
                className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white cursor-pointer shadow-lg transition"
              >
                <Camera size={18} />
              </label>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="text"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className={`${inputClass} bg-gray-100 dark:bg-gray-950 cursor-not-allowed`}
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="text"
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full mt-2 border dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Role
              </label>
              <div className="relative">
                <ShieldCheck size={16} className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="text"
                  value={user?.role || ""}
                  disabled
                  className={`${inputClass} bg-gray-100 dark:bg-gray-950 capitalize cursor-not-allowed`}
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="border dark:border-gray-800 rounded-2xl p-6 bg-gray-50 dark:bg-gray-950">
            <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin size={20} className="text-indigo-600 dark:text-indigo-400" />
              Saved Addresses
            </h2>

            {addresses.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No addresses added yet.
              </p>
            )}

            <div className="space-y-3">
              {addresses.map((addr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">
                        {addr.fullName}
                      </h3>
                      <p>{addr.phone}</p>
                      <p>{addr.address}</p>
                      <p>
                        {addr.city}, {addr.state}
                      </p>
                      <p>
                        {addr.pincode}, {addr.country}
                      </p>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-semibold">
                          <Star size={12} fill="currentColor" /> Default Address
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition"
                      onClick={() => {
                        const copy = [...addresses];
                        copy.splice(index, 1);
                        setAddresses(copy);
                      }}
                      aria-label="Delete address"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add New Address */}
            <div className="mt-6 border-t dark:border-gray-800 pt-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Plus size={18} className="text-indigo-600 dark:text-indigo-400" />
                Add New Address
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { key: "fullName", placeholder: "Full Name" },
                  { key: "phone", placeholder: "Phone" },
                  { key: "address", placeholder: "Address", span: true },
                  { key: "city", placeholder: "City" },
                  { key: "state", placeholder: "State" },
                  { key: "pincode", placeholder: "Pincode" },
                  { key: "country", placeholder: "Country" },
                ].map(({ key, placeholder, span }) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={placeholder}
                    className={`border dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none ${span ? "sm:col-span-2" : ""}`}
                    value={newAddress[key]}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, [key]: e.target.value })
                    }
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  id="defaultAddress"
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, isDefault: e.target.checked })
                  }
                />
                <label
                  htmlFor="defaultAddress"
                  className="select-none cursor-pointer text-gray-700 dark:text-gray-300 text-sm"
                >
                  Set as Default Address
                </label>
              </div>

              <button
                type="button"
                onClick={handleAddAddress}
                className="mt-5 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow transition"
              >
                <Plus size={18} />
                Add Address
              </button>
            </div>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
