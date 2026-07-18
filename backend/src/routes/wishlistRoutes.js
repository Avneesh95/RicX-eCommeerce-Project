const express = require("express");

const router = express.Router();

const {
  isAuthenticated,
} = require("../middleware/authMiddleware");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.get(
  "/",
  isAuthenticated,
  getWishlist
);

router.post(
  "/add",
  isAuthenticated,
  addToWishlist
);

router.delete(
  "/remove/:productId",
  isAuthenticated,
  removeFromWishlist
);

module.exports = router;