import api from "./axios";

// ======================
// GET WISHLIST
// ======================
export const getWishlist = async () => {
  return await api.get("/wishlist");
};

// ======================
// ADD TO WISHLIST
// ======================
export const addToWishlist = async (productId) => {
  return await api.post("/wishlist/add", {
    productId,
  });
};

// ======================
// REMOVE FROM WISHLIST
// ======================
export const removeFromWishlist = async (productId) => {
  return await api.delete(`/wishlist/remove/${productId}`);
};