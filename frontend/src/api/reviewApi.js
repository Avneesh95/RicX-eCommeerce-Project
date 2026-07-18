import api from "./axios";

// ======================
// Get Reviews
// ======================
export const getReviews = (productId) => {
  return api.get(`/reviews/${productId}`);
};

// ======================
// Add Review
// ======================
export const addReview = (productId, reviewData) => {
  return api.post(`/reviews/${productId}`, reviewData);
};

// ======================
// Delete Review
// ======================
export const deleteReview = (reviewId) => {
  return api.delete(`/reviews/${reviewId}`);
};