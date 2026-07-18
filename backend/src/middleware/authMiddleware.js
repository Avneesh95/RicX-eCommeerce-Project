const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

// ==============================
// Basic JWT Authentication
// ==============================

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ==============================
// Alias
// ==============================

const isAuthenticated = authMiddleware;

// ==============================
// Admin Middleware
// ==============================

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  if (
    req.user.role !== "admin" &&
    req.user.role !== "superAdmin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

// ==============================
// Super Admin Middleware
// ==============================

const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  if (req.user.role !== "superAdmin") {
    return res.status(403).json({
      success: false,
      message: "Super Admin access required",
    });
  }

  next();
};


// ==============================
// Seller Middleware
// ==============================

const isSeller = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  if (req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Approved seller access required",
    });
  }

  next();
};

const isAdminOrSeller = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  if (!["admin", "superAdmin", "seller"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Admin or seller access required",
    });
  }

  next();
};

// ==============================
// Exports
// ==============================

module.exports = {
  authMiddleware,
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  isSeller,
  isAdminOrSeller,
};