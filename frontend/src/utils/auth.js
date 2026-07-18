export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getRole = () => {
  return localStorage.getItem("role");
};

// ==========================
// FORGOT PASSWORD
// ==========================
export const forgotPassword = async (email) => {
  return await api.post("/auth/forgetPassword", {
    email,
  });
};

// ==========================
// RESET PASSWORD
// ==========================
export const resetPassword = async (data) => {
  return await api.post("/auth/resetPassword", data);
};