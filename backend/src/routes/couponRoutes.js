
const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getCoupons,
  deleteCoupon,
  toggleCoupon,
  applyCoupon,
  setHeroCoupon,
  getHeroCoupon,
} = require("../controllers/couponController");

const {
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
} = require("../middleware/authMiddleware");

/* ========================================================
   PUBLIC ROUTES (No Auth Required)
   Put these first so they don't get trapped by middleware or /:id
   ======================================================== */

// Get active hero banner coupon for home page
router.get("/hero", getHeroCoupon);


/* ========================================================
   AUTHENTICATED ROUTES (User/Customer)
   ======================================================== */

// Apply coupon code at checkout
router.post(
  "/apply",
  isAuthenticated,
  applyCoupon
);


/* ========================================================
   ADMIN & SUPER ADMIN ROUTES
   ======================================================== */

// Create a new coupon
router.post(
  "/create",
  isAuthenticated,
  isAdmin,
  createCoupon
);

// Get list of all coupons (Admin dashboard view)
router.get(
  "/",
  isAuthenticated,
  isAdmin,
  getCoupons
);

// Toggle coupon active status
router.put(
  "/toggle/:id",
  isAuthenticated,
  isAdmin,
  toggleCoupon
);

// Delete a coupon
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  deleteCoupon
);

// Update which coupon is featured on the hero banner
router.put(
  "/hero/:id",
  isAuthenticated,
  isAdmin, // Changed to Admin to match your dashboard setup requirement
  setHeroCoupon
);

module.exports = router;