const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isSuperAdmin,
} = require("../middleware/authMiddleware");

const {
  getDashboard,
  getAdmins,
  getUsers,
  makeAdmin,
  removeAdmin,
  blockUser,
  unblockUser,
} = require("../controllers/superAdminController");

router.get("/dashboard", isAuthenticated, isSuperAdmin, getDashboard);

router.get("/admins", isAuthenticated, isSuperAdmin, getAdmins);

router.get("/users", isAuthenticated, isSuperAdmin, getUsers);

router.put("/make-admin/:id", isAuthenticated, isSuperAdmin, makeAdmin);

router.put("/remove-admin/:id", isAuthenticated, isSuperAdmin, removeAdmin);

router.put("/block/:id", isAuthenticated, isSuperAdmin, blockUser);

router.put("/unblock/:id", isAuthenticated, isSuperAdmin, unblockUser);

module.exports = router;