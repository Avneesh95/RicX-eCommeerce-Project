const User = require("../model/UserModel");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");

/* ==========================================================
   SUPER ADMIN DASHBOARD
========================================================== */

exports.getDashboard = async (req, res) => {
  try {
    // Counts
    const totalProducts = await Product.countDocuments();

    const totalUsers = await User.countDocuments({
      role: "customer",
    });

    const totalAdmins = await User.countDocuments({
      role: {
        $in: ["admin", "superAdmin"],
      },
    });

    const totalOrders = await Order.countDocuments();

    // Revenue
    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    // Latest Users
    const latestUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,

      products: totalProducts,

      users: totalUsers,

      admins: totalAdmins,

      orders: totalOrders,

      revenue: totalRevenue,

      latestUsers,

      recentOrders,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==========================================================
   GET ADMINS
========================================================== */

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: {
        $in: ["admin", "superAdmin"],
      },
    }).select("-password");

    res.status(200).json({
      success: true,
      admins,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==========================================================
   GET USERS
========================================================== */

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: {
        $ne: "superAdmin",
      },
    }).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==========================================================
   PROMOTE USER TO ADMIN
========================================================== */

exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = "admin";

    user.permissions = {
      manageProducts: true,
      manageOrders: true,
      manageUsers: false,
      manageCoupons: true,
      manageAnalytics: true,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "User promoted to Admin",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==========================================================
   REMOVE ADMIN
========================================================== */

exports.removeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "superAdmin") {
      return res.status(400).json({
        success: false,
        message: "Cannot remove Super Admin",
      });
    }

    user.role = "user";

    user.permissions = {};

    await user.save();

    res.status(200).json({
      success: true,
      message: "Admin removed successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==========================================================
   BLOCK USER
========================================================== */

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==========================================================
   UNBLOCK USER
========================================================== */

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = false;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};