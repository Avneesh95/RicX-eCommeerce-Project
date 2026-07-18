const express = require("express");
const router = express.Router();

const {
  getTotalRevenue,
  getTotalOrders,
  getTotalUsers,
  makeAdmin,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAnalytics,
} = require("../controllers/adminController");

const {
  isAuthenticated,
  isAdmin,
} = require("../middleware/authMiddleware");

// ==============================
// DASHBOARD
// ==============================
router.get(
  "/dashboard",
  isAuthenticated,
  isAdmin,
  getDashboardStats
);

router.get(
  "/analytics",
  isAuthenticated,
  isAdmin,
  getAnalytics
);

// ==============================
// STATISTICS
// ==============================
router.get(
  "/revenue",
  isAuthenticated,
  isAdmin,
  getTotalRevenue
);

router.get(
  "/orders",
  isAuthenticated,
  isAdmin,
  getTotalOrders
);

router.get(
  "/users/count",
  isAuthenticated,
  isAdmin,
  getTotalUsers
);

// ==============================
// USER MANAGEMENT
// ==============================
router.get(
  "/users",
  isAuthenticated,
  isAdmin,
  getAllUsers
);

router.put(
  "/users/:id/role",
  isAuthenticated,
  isAdmin,
  makeAdmin
);

router.delete(
  "/users/:id",
  isAuthenticated,
  isAdmin,
  deleteUser
);

module.exports = router;