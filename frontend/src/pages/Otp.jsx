import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function OTP() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email received from Register.jsx
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // If user opens /otp directly
  if (!email) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await api.post("/auth/register/verify-otp", {
        email,
        otp,
      });

      setMessage(response.data.message || "OTP Verified Successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setIsError(true);
      setMessage(
        err.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      const response = await api.post("/auth/resend-otp", {
        email,
      });

      setIsError(false);
      setMessage(response.data.message || "OTP Sent Again!");
    } catch (err) {
      setIsError(true);
      setMessage(
        err.response?.data?.message || "Unable to resend OTP"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-brown from-indigo-100 to-blue-200 flex justify-center items-center px-4">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Verify OTP
        </h1>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
          OTP has been sent to
        </p>

        <p className="text-center font-semibold text-indigo-600 mb-6">
          {email}
        </p>

        {message && (
          <div
            className={`mb-5 rounded-lg p-3 text-center ${
              isError
                ? "bg-red-100 text-red-700 border dark:border-gray-800 border-red-300"
                : "bg-green-100 text-green-700 border dark:border-gray-800 border-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Enter OTP
            </label>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full border dark:border-gray-800 rounded-lg px-4 py-3 text-center text-2xl tracking-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <button
          onClick={resendOTP}
          className="w-full mt-4 text-indigo-600 hover:underline"
        >
          Resend OTP
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"
        >
          Back to Register
        </button>

      </div>
    </div>
  );
}