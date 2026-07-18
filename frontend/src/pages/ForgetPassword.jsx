import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../api/authApi";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await forgetPassword({
        email,
      });

      setMessage(res.data.message);

      localStorage.setItem("resetEmail", email);

      setTimeout(() => {
        navigate("/reset-password");
      }, 1500);
    } catch (err) {
      setIsError(true);

      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex justify-center items-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-8">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-indigo-600 hover:underline mb-6"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Forgot Password</h1>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
          Enter your registered email to receive an OTP.
        </p>

        {message && (
          <div
            className={`mt-5 p-3 rounded-lg text-center ${
              isError
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300">Email Address</label>

            <div className="relative mt-2">
              <Mail className="absolute left-4 top-4 text-gray-400" size={20} />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
