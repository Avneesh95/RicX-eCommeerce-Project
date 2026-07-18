const User = require("../model/UserModel");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");

// ==============================
// TOTAL USERS
// ==============================
const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// ANALYTICS
// ==============================
const getAnalytics = async (req, res) => {
  try {
    // ===============================
    // Get all PAID orders once
    // ===============================
    const paidOrders = await Order.find({
      paymentStatus: "paid",
    });

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = paidOrders.length;

    // ===============================
    // Total Revenue
    // ===============================
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // ===============================
    // Monthly Revenue
    // ===============================
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ===============================
    // Monthly Orders
    // ===============================
    const monthlyOrders = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ===============================
    // Category Distribution
    // ===============================
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: 1 },
        },
      },
    ]);

    // ===============================
    // Low Stock Products
    // ===============================
    const lowStock = await Product.find({
      stock: { $lte: 5 },
    }).select("name stock category");

    // ===============================
    // Debug Logs
    // ===============================
    console.log("========== ANALYTICS ==========");
    console.log("Paid Orders:", totalOrders);
    console.log("Revenue:", totalRevenue);
    console.log("Monthly Orders:", monthlyOrders);
    console.log("Monthly Revenue:", monthlyRevenue);
    console.log("===============================");

    // ===============================
    // Response
    // ===============================
    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
      },
      monthlyRevenue,
      monthlyOrders,
      categoryStats,
      lowStock,
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// GET ALL USERS
// ==============================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// DELETE USER
// ==============================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// TOTAL ORDERS
// ==============================
const getTotalOrders = async (req, res) => {
  try {
   totalOrders = await Order.countDocuments({
    paymentStatus: "paid",
}); 

    res.status(200).json({
      success: true,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// TOTAL REVENUE
// ==============================
const getTotalRevenue = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      revenue: result[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// CHANGE USER ROLE
// ==============================
const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// ADMIN DASHBOARD
// ==============================
const getDashboardStats = async (req, res) => {
  try {
    const [users, orders, products] = await Promise.all([
      User.countDocuments(),

      // Count only successful orders
      Order.countDocuments({
        paymentStatus: "paid",
      }),

      Product.countDocuments(),
    ]);

    // Revenue from paid orders only
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    // Show only successful orders in dashboard
    const recentOrders = await Order.find({
      paymentStatus: "paid",
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const latestUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      users,
      products,
      orders,
      revenue: revenueResult[0]?.totalRevenue || 0,
      recentOrders,
      latestUsers,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTotalUsers,
  getAllUsers,
  deleteUser,
  getTotalOrders,
  getTotalRevenue,
  makeAdmin,
  getDashboardStats,
  getAnalytics,
};
