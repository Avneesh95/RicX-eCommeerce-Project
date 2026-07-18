const express = require("express");

const router = express.Router();

const {
  addReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewController");

const {
  isAuthenticated,
} = require("../middleware/authMiddleware");

// Public
router.get("/:productId", getReviews);

// Protected
router.post(
  "/:productId",
  isAuthenticated,
  addReview
);

router.delete(
  "/:reviewId",
  isAuthenticated,
  deleteReview
);

module.exports = router;