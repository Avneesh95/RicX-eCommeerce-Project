const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isAdmin,
  isSeller,
} = require("../middleware/authMiddleware");

const {
  applyForSeller,
  getMyApplication,
  updateMyProfile,
  getAllSellers,
  approveSeller,
  rejectSeller,
  setSellerSuspension,
} = require("../controllers/sellerController");

const {
  getMyOrders,
  updateMyItemStatus,
  getMyEarnings,
} = require("../controllers/sellerOrderController");

const {
  getSellerProfile,
  getSellerReviews,
  addSellerReview,
} = require("../controllers/sellerReviewController");

// ======================
// Public
// ======================
router.get("/:id/profile", getSellerProfile);
router.get("/:id/reviews", getSellerReviews);

// ======================
// Any logged-in user
// ======================
router.post("/apply", isAuthenticated, applyForSeller);
router.get("/me/application", isAuthenticated, getMyApplication);
router.post("/:id/reviews", isAuthenticated, addSellerReview);

// ======================
// Approved Seller Only
// ======================
router.put("/me/profile", isAuthenticated, isSeller, updateMyProfile);
router.get("/me/orders", isAuthenticated, isSeller, getMyOrders);
router.get("/me/earnings", isAuthenticated, isSeller, getMyEarnings);
router.put(
  "/me/orders/:orderId/items/:itemId",
  isAuthenticated,
  isSeller,
  updateMyItemStatus
);

// ======================
// Admin / Super Admin Only
// ======================
router.get("/admin/all", isAuthenticated, isAdmin, getAllSellers);
router.put("/admin/:id/approve", isAuthenticated, isAdmin, approveSeller);
router.put("/admin/:id/reject", isAuthenticated, isAdmin, rejectSeller);
router.put(
  "/admin/:id/suspension",
  isAuthenticated,
  isAdmin,
  setSellerSuspension
);

module.exports = router;
