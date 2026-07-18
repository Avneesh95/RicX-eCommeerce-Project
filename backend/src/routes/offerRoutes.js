const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getActiveHeroOffer,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");

const {
  isAuthenticated,
  isSuperAdmin,
} = require("../middleware/authMiddleware");

// ======================
// Public
// ======================

// Get the currently active hero banner
router.get("/active", getActiveHeroOffer);

// ======================
// Super Admin Only
// ======================

router.get("/", isAuthenticated, isSuperAdmin, getAllOffers);

router.post(
  "/",
  isAuthenticated,
  isSuperAdmin,
  upload.single("banner"),
  createOffer
);

router.put(
  "/:id",
  isAuthenticated,
  isSuperAdmin,
  upload.single("banner"),
  updateOffer
);

router.delete("/:id", isAuthenticated, isSuperAdmin, deleteOffer);

module.exports = router;
