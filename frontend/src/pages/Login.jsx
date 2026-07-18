
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const { data } = await api.post("/auth/login", form);

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      if (data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "role",
          data.user.role || "user"
        );
      }

      setMessage("Login Successful!");

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 800);
    } catch (err) {
      setIsError(true);

      setMessage(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">

        {/* Header */}

        <div className="text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">

            <LogIn
              size={34}
              className="text-white"
            />

          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Login to continue shopping on RicX
          </p>

        </div>

        {/* Alert */}

        {message && (
          <div
            className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
              isError
                ? "bg-red-100 text-red-700 border dark:border-gray-800 border-red-300"
                : "bg-green-100 text-green-700 border dark:border-gray-800 border-green-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Email */}

          <div>

            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </label>

            <div className="relative mt-2">

              <Mail
                size={20}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 rounded-xl border dark:border-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>

            <div className="relative mt-2">

              <Lock
                size={20}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 rounded-xl border dark:border-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Forgot Password */}

          <div className="flex justify-end">

            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-bold transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] hover:shadow-xl"
            }`}
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

        </form>

        {/* Register */}

        <div className="mt-8 text-center">

          <p className="text-gray-600 dark:text-gray-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-bold text-indigo-600 hover:underline"
            >
              Register Now
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

