const express = require("express");
const router = express.Router();

const { generateInvoice } = require("../controllers/invoiceController");
const { isAuthenticated } = require("../middleware/authMiddleware");


router.get(
  "/:id",
  isAuthenticated,
  generateInvoice
);



module.exports = router;