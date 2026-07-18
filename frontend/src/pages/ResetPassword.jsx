import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail") || "";

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    if (form.newPassword !== form.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({
        email,
        otp: form.otp,
        newPassword: form.newPassword,
      });

      setMessage(res.data.message);

      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setIsError(true);

      setMessage(
        err.response?.data?.message ||
          "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex justify-center items-center px-4">

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 w-full max-w-md">

        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">

            <KeyRound className="text-white" size={34} />

          </div>

        </div>

        <h1 className="text-3xl font-bold text-center mt-5 text-gray-900 dark:text-white">
          Reset Password
        </h1>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
          Enter the OTP sent to your email and choose a new password.
        </p>

        {message && (
          <div
            className={`mt-5 rounded-xl px-4 py-3 text-center ${
              isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* OTP */}

          <div>

            <label className="font-semibold text-gray-700 dark:text-gray-300">
              OTP
            </label>

            <input
              type="text"
              name="otp"
              required
              maxLength={6}
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
              className="w-full border dark:border-gray-800 rounded-xl px-4 py-3 mt-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

          </div>

          {/* New Password */}

          <div>

            <label className="font-semibold text-gray-700 dark:text-gray-300">
              New Password
            </label>

            <div className="relative mt-2">

              <Lock
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                required
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full pl-12 pr-12 py-3 border dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-4"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Confirm Password */}

          <div>

            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border dark:border-gray-800 rounded-xl px-4 py-3 mt-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] transition"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}