import api from "./axios";

// Profile
export const getProfile = () => api.get("/auth/me");

export const updateProfile = (formData) =>
  api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Password
export const changePassword = (data) =>
  api.put("/auth/change-password", data);

// Address
export const addAddress = (data) =>
  api.post("/auth/address", data);

export const updateAddress = (id, data) =>
  api.put(`/auth/address/${id}`, data);

export const deleteAddress = (id) =>
  api.delete(`/auth/address/${id}`);

export const makeDefault = (id) =>
  api.put(`/auth/address/default/${id}`);