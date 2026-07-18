const Seller = require("../model/sellerModel");
const User = require("../model/UserModel");

// =========================
// Apply to become a seller (any logged-in user)
// =========================
const applyForSeller = async (req, res) => {
  try {
    const { businessName, description, contactEmail, contactPhone } =
      req.body;

    if (!businessName) {
      return res.status(400).json({
        success: false,
        message: "Business name is required",
      });
    }

    if (req.user.role === "seller") {
      return res.status(400).json({
        success: false,
        message: "You are already an approved seller",
      });
    }

    const existing = await Seller.findOne({ user: req.user._id });

    if (existing && existing.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "You already have a pending seller application",
      });
    }

    if (existing && existing.status === "suspended") {
      return res.status(400).json({
        success: false,
        message: "Your seller account is suspended. Contact support.",
      });
    }

    let application;

    if (existing) {
      // Re-applying after a rejection
      existing.businessName = businessName;
      existing.description = description || "";
      existing.contactEmail = contactEmail || req.user.email;
      existing.contactPhone = contactPhone || "";
      existing.status = "pending";
      existing.rejectionReason = "";
      application = await existing.save();
    } else {
      application = await Seller.create({
        user: req.user._id,
        businessName,
        description: description || "",
        contactEmail: contactEmail || req.user.email,
        contactPhone: contactPhone || "",
        status: "pending",
      });
    }

    res.status(201).json({
      success: true,
      message: "Seller application submitted",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get my own seller application/profile status
// =========================
const getMyApplication = async (req, res) => {
  try {
    const application = await Seller.findOne({ user: req.user._id });

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update my seller profile (approved sellers only)
// =========================
const updateMyProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const { businessName, description, contactEmail, contactPhone } =
      req.body;

    if (businessName !== undefined) seller.businessName = businessName;
    if (description !== undefined) seller.description = description;
    if (contactEmail !== undefined) seller.contactEmail = contactEmail;
    if (contactPhone !== undefined) seller.contactPhone = contactPhone;

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ADMIN: Get all seller applications (optionally filter by status)
// =========================
const getAllSellers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const sellers = await Seller.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      sellers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ADMIN: Approve a seller application
// =========================
const approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller application not found",
      });
    }

    seller.status = "approved";
    seller.rejectionReason = "";
    await seller.save();

    if (seller.user) {
      await User.findByIdAndUpdate(seller.user, { role: "seller" });
    }

    res.status(200).json({
      success: true,
      message: "Seller approved",
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ADMIN: Reject a seller application
// =========================
const rejectSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller application not found",
      });
    }

    seller.status = "rejected";
    seller.rejectionReason = req.body.reason || "";
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller application rejected",
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ADMIN: Suspend / reinstate an approved seller
// =========================
const setSellerSuspension = async (req, res) => {
  try {
    const { suspend } = req.body;

    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.status = suspend ? "suspended" : "approved";
    await seller.save();

    if (seller.user) {
      await User.findByIdAndUpdate(seller.user, {
        role: suspend ? "user" : "seller",
      });
    }

    res.status(200).json({
      success: true,
      message: suspend ? "Seller suspended" : "Seller reinstated",
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  applyForSeller,
  getMyApplication,
  updateMyProfile,
  getAllSellers,
  approveSeller,
  rejectSeller,
  setSellerSuspension,
};
