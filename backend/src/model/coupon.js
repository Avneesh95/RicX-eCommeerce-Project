const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    maxDiscount: {
      type: Number,
      default: 0,
    },

    usageLimit: {
      type: Number,
      default: 1000,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    /* ================= HERO SECTION ================= */

    heroTitle: {
      type: String,
      default: "",
    },

    heroSubtitle: {
      type: String,
      default: "",
    },

    heroButtonText: {
      type: String,
      default: "Shop Now",
    },

    heroImage: {
      type: String,
      default: "",
    },

    showOnHero: {
      type: Boolean,
      default: false,
    },
    showOnHero: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Coupon", couponSchema);
