import api from "./axios";

// =========================
// LOGIN
// =========================
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// =========================
// REGISTER
// =========================
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// =========================
// VERIFY OTP
// =========================
export const verifyOtp = (data) => {
  return api.post("/auth/register/verify-otp", data);
};

// =========================
// FORGOT PASSWORD
// =========================
export const forgetPassword = (data) => {
  return api.post("/auth/forgetPassword", data);
};

// =========================
// RESET PASSWORD
// =========================
export const resetPassword = (data) => {
  return api.post("/auth/resetPassword", data);
};

// =========================
// GET MY PROFILE
// =========================
export const getProfile = () => {
  return api.get("/auth/me");
};

// =========================
// UPDATE PROFILE
// =========================
export const updateProfile = (formData) => {
  return api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};