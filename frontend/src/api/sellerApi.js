import api from "./axios";

// =========================
// Any logged-in user
// =========================
export const applyForSeller = (payload) => api.post("/seller/apply", payload);
export const getMyApplication = () => api.get("/seller/me/application");
export const addSellerReview = (sellerId, payload) =>
  api.post(`/seller/${sellerId}/reviews`, payload);

// =========================
// Public
// =========================
export const getSellerProfile = (sellerId) =>
  api.get(`/seller/${sellerId}/profile`);
export const getSellerReviews = (sellerId) =>
  api.get(`/seller/${sellerId}/reviews`);

// =========================
// Approved seller
// =========================
export const updateMySellerProfile = (payload) =>
  api.put("/seller/me/profile", payload);
export const getMyOrders = () => api.get("/seller/me/orders");
export const getMyEarnings = () => api.get("/seller/me/earnings");
export const updateMyItemStatus = (orderId, itemId, status) =>
  api.put(`/seller/me/orders/${orderId}/items/${itemId}`, { status });

// =========================
// Admin / Super Admin
// =========================
export const getAllSellerApplications = (status) =>
  api.get(`/seller/admin/all${status ? `?status=${status}` : ""}`);
export const approveSellerApplication = (id) =>
  api.put(`/seller/admin/${id}/approve`);
export const rejectSellerApplication = (id, reason) =>
  api.put(`/seller/admin/${id}/reject`, { reason });
export const setSellerSuspension = (id, suspend) =>
  api.put(`/seller/admin/${id}/suspension`, { suspend });
