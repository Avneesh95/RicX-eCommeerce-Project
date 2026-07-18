const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

const { isAuthenticated } = require("../middleware/authMiddleware");

router.post("/add", isAuthenticated, addToCart);

router.get("/", isAuthenticated, getCart);

router.put("/update", isAuthenticated, updateCartItem);

router.delete("/remove/:productId", isAuthenticated, removeFromCart);

module.exports = router;
