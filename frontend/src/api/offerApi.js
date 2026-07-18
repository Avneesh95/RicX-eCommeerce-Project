import api from "./axios";

// =========================
// GET ACTIVE HERO BANNER (public)
// =========================
export const getActiveHeroOffer = () => {
  return api.get("/offer/active");
};

// =========================
// GET ALL OFFERS (super admin)
// =========================
export const getAllOffers = () => {
  return api.get("/offer");
};

// =========================
// CREATE OFFER / HERO BANNER (super admin)
// =========================
export const createOffer = (formData) => {
  return api.post("/offer", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// =========================
// UPDATE OFFER / HERO BANNER (super admin)
// =========================
export const updateOffer = (id, formData) => {
  return api.put(`/offer/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// =========================
// DELETE OFFER (super admin)
// =========================
export const deleteOffer = (id) => {
  return api.delete(`/offer/${id}`);
};
