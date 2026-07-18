const express = require("express");
const router = express.Router();

const {
  placeOrder,
  buyNowOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
} = require("../controllers/orderController");

const {
  isAuthenticated,
  isAdmin,
} = require("../middleware/authMiddleware");

// ======================
// USER ROUTES
// ======================

// Cart Checkout
router.post("/place", isAuthenticated, placeOrder);

// Buy Now Checkout
router.post("/buy-now", isAuthenticated, buyNowOrder);

// My Orders
router.get("/my", isAuthenticated, getMyOrders);

// Cancel Order
router.put("/cancel/:id", isAuthenticated, cancelOrder);

// Single Order
router.get("/:id", isAuthenticated, getOrderById);

// ======================
// ADMIN ROUTES
// ======================

// All Orders
router.get("/", isAuthenticated, isAdmin, getAllOrders);

// Update Status
router.put("/:id", isAuthenticated, isAdmin, updateOrderStatus);

// Delete Order
router.delete("/:id", isAuthenticated, isAdmin, deleteOrder);

module.exports = router;