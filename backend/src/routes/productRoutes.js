const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createProduct,
  products,
  getProductById,
  getRelatedProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  downloadSampleTemplate,
} = require("../controllers/productController");

const {
  isAuthenticated,
  isAdmin,
  isSeller,
  isAdminOrSeller,
} = require("../middleware/authMiddleware");

// ======================
// Seller: My Products (must come before /:id)
// ======================
router.get("/mine", isAuthenticated, isSeller, getMyProducts);

// ======================
// Public Routes
// ======================

// Get all products
router.get("/", products);

// Download the sample bulk-upload template
router.get(
  "/bulk-upload/sample",
  isAuthenticated,
  isAdminOrSeller,
  downloadSampleTemplate
);

// Get related products ("you may also like")
router.get("/:id/related", getRelatedProducts);

// Get single product
router.get("/:id", getProductById);

// ======================
// Admin & Seller Routes
// ======================

// Create product
router.post(
  "/add",
  isAuthenticated,
  isAdminOrSeller,
  upload.single("image"),
  createProduct
);

// Update product (ownership checked inside controller for sellers)
router.put(
  "/:id",
  isAuthenticated,
  isAdminOrSeller,
  upload.single("image"),
  updateProduct
);

// Delete product (ownership checked inside controller for sellers)
router.delete("/:id", isAuthenticated, isAdminOrSeller, deleteProduct);

// Bulk upload — admin (platform catalog) or seller (their own products)
router.post(
  "/bulk-upload",
  isAuthenticated,
  isAdminOrSeller,
  upload.single("file"),
  bulkUploadProducts
);

module.exports = router;
