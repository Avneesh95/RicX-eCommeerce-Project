import axios from "axios";

const hostname = window.location.hostname;

// 1. Explicitly isolate local development environments
const isLocalEnv =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname.startsWith("192.168.") ||
  hostname.endsWith(".local");

// 2. Use local backend during local dev, production URL otherwise.
//    Override with VITE_API_URL in a .env file if your local backend
//    runs on a different port than 4000.
const localBaseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const liveBaseURL = "https://ricx.onrender.com/api";

const resolvedBaseURL = isLocalEnv ? localBaseURL : liveBaseURL;

const api = axios.create({
  baseURL: resolvedBaseURL,
});

if (isLocalEnv) {
  console.log("🛠️ Axios BaseURL (local dev):", resolvedBaseURL);
}

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("❌ API ERROR:", {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;