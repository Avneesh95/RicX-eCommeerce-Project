import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import OTP from "./Otp";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await api.post("/auth/register", form);

      setMessage(response.data.message || "OTP sent successfully!");

      // Redirect to OTP page after a short delay
      setTimeout(() => {
        navigate("/otp", {
          state: {
            email: form.email,
          },
        });
      }, 1000);
    } catch (err) {
      setIsError(true);
      setMessage(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-brown from-indigo-100 to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Welcome to RicX
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
          Create your account
        </p>

        {message && (
          <div
            className={`mt-5 rounded-lg px-4 py-3 text-sm ${
              isError
                ? "bg-red-100 text-red-700 border dark:border-gray-800 border-red-300"
                : "bg-green-100 text-green-700 border dark:border-gray-800 border-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            {loading ? "Sending OTP..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}