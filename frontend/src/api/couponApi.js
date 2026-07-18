import api from "./axios";

/* ==========================================
   GET ALL COUPONS
========================================== */

export const getCoupons = (
  page = 1,
  keyword = ""
) => {
  return api.get(
    `/coupon?page=${page}&keyword=${keyword}`
  );
};

/* ==========================================
   GET SINGLE COUPON
========================================== */

export const getCoupon = (id) => {
  return api.get(`/coupon/${id}`);
};

/* ==========================================
   CREATE COUPON
========================================== */

export const createCoupon = (couponData) => {
  return api.post("/coupon/create", couponData);
};

/* ==========================================
   UPDATE COUPON
========================================== */

export const updateCoupon = (id, couponData) => {
  return api.put(`/coupon/${id}`, couponData);
};

/* ==========================================
   DELETE COUPON
========================================== */

export const deleteCoupon = (id) => {
  return api.delete(`/coupon/${id}`);
};

/* ==========================================
   ENABLE / DISABLE COUPON
========================================== */

export const toggleCoupon = (id) => {
  return api.put(`/coupon/toggle/${id}`);
};

/* ==========================================
   RESET USAGE
========================================== */

export const resetCouponUsage = (id) => {
  return api.put(`/coupon/reset/${id}`);
};

/* ==========================================
   APPLY COUPON
========================================== */

export const applyCoupon = (data) => {
  return api.post("/coupon/apply", data);
};

/* ==========================================
   SET HERO COUPON
========================================== */

export const setHeroCoupon = (id) => {
  return api.put(`/coupon/hero/${id}`);
};

/* ==========================================
   GET HERO COUPON
========================================== */

export const getHeroCoupon = () => {
  return api.get("/coupon/hero");
};